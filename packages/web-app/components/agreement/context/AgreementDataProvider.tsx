import { ReactNode, useEffect, useMemo, useState } from "react";

import { BigNumber } from "ethers";
import { useAccount, useToken, useNetwork } from "wagmi";
import { AgreementWithPositions } from "../../../lib/types";
import { useDisputeConfig } from "../../../hooks/useAgreement";
import {
	AgreementParams,
	AgreementDataContext,
	AgreementDataContextType,
} from "./AgreementDataContext";
import { Token, UserPosition } from "./types";
import { IPFSUriToUrl, fetchAgreementTerms } from "../../../utils";

export const useAgreement = ({ id }: { id: string }) => {
	const { chain } = useNetwork();
	const [agreement, setAgreement] = useState<AgreementWithPositions>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		async function fetchAgreement() {
			try {
				const chainId = chain?.id || 1;
				const response = await fetch(`/api/${chainId}/agreement/${id}`);
				if (!response.ok) {
					setAgreement(undefined);
					setError(response.statusText);
				} else {
					const data = await response.json();
					if (data instanceof Object) {
						setAgreement(data);
					}
				}
			} catch (error) {
				setError("Error fetching agreements");
			}
			setIsLoading(false);
		}
		setIsLoading(true);
		fetchAgreement();
	}, [chain, id]);

	return { agreement, isLoading, error };
};

const useTokenFromAddress = (address: string | undefined): Token | undefined => {
	const memoAddress = useMemo(() => address, [address]);
	const { data: tokenData } = useToken({
		address: memoAddress,
		enabled: memoAddress !== undefined,
	});

	const token = useMemo(() => {
		if (tokenData) {
			return {
				name: tokenData.name,
				symbol: tokenData.symbol,
				decimals: tokenData.decimals,
				address: tokenData.address,
			};
		}
	}, [tokenData]);

	return token;
};

const defaultAgreementParams = ({ id }: { id: string }): AgreementParams => ({
	id: id,
	title: undefined,
	status: undefined,
	termsHash: undefined,
});

interface TermsData {
	termsPrivacy: string;
	termsURI?: string;
	termsFilename?: string;
}

const defaultTermsData: TermsData = {
	termsPrivacy: "private",
	termsURI: undefined,
	termsFilename: undefined,
};

export const AgreementDataProvider = ({ id, children }: { id: string; children: ReactNode }) => {
	const { address: userAddress } = useAccount();
	const [agreementParams, setAgreementParams] = useState<AgreementParams>(
		defaultAgreementParams({ id }),
	);
	const { agreement, isLoading } = useAgreement({ id });
	const [userPosition, setUserPosition] = useState<UserPosition>();
	const [termsData, setTermsData] = useState<TermsData>(defaultTermsData);
	const [termsFile, setTermsFile] = useState<string>();

	/* GET AGREEMENT DATA FROM CONTRACT */
	/*
	const { data: agreementData, positions: agreementPositions } = useAgreementData({
		id: id,
		enabled: id != "undefined",
	});
	*/

	/* Update params when agreement changes */
	useEffect(() => {
		if (agreement) {
			const params = {
				id: agreement.id,
				title: agreement.title,
				status: agreement.status,
				termsHash: agreement.termsHash,
			};
			if (params != agreementParams) {
				setAgreementParams(params);
			}
		} else {
			setAgreementParams(defaultAgreementParams({ id }));
		}
	}, [agreement, agreementParams]);

	useEffect(() => {
		const fetchTerms = async (termsURI: string) => {
			const terms = await fetchAgreementTerms(termsURI);
			if (terms) setTermsFile(terms);
		};

		if (agreement) {
			const terms = {
				termsPrivacy: agreement.termsPrivacy,
				termsURI: agreement.termsURI,
				termsFilename: agreement.termsFilename,
			};
			if (terms != termsData) {
				setTermsData(terms);
				if (terms.termsURI) fetchTerms(terms.termsURI);
			}
		} else {
			setTermsData(defaultTermsData);
			setTermsFile(undefined);
		}
	}, [agreement, termsData]);

	/* Token fetching logic */
	// FIXME: Replace with token data from api query
	const collateralToken = useTokenFromAddress(agreement?.token);
	const depositToken = {
		name: "Nation3",
		symbol: "NATION",
		address: "0x333A4823466879eeF910A04D473505da62142069",
		decimals: 18,
	};

	const { amount: disputeAmount } = useDisputeConfig();
	const disputeCost = useMemo(() => {
		return disputeAmount ?? BigNumber.from(0);
	}, [disputeAmount]);

	/* Update user position with agreement positions data */
	useEffect(() => {
		if (userAddress && agreement?.positions) {
			const position = agreement?.positions.find((position) => position.party === userAddress);
			setUserPosition(position);
		} else {
			setUserPosition(undefined);
		}
	}, [userAddress, agreement?.positions]);

	const provider: AgreementDataContextType = {
		id,
		title: agreementParams.title,
		termsHash: agreementParams.termsHash,
		status: agreementParams.status,
		collateralToken,
		depositToken,
		disputeCost,
		positions: agreement?.positions,
		userPosition,
		isLoading,
		fileName: termsData.termsFilename,
		fileStatus: termsData.termsPrivacy,
		termsFile: "",
	};

	return <AgreementDataContext.Provider value={provider}>{children}</AgreementDataContext.Provider>;
};
