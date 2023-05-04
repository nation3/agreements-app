import { ReactNode, useEffect, useMemo, useState } from "react";

import { BigNumber } from "ethers";
import { useAccount, useToken } from "wagmi";
import { useAgreementData, useDisputeConfig } from "../../../hooks/useAgreement";
import { trimHash } from "../../../utils/hash";
import { fetchAgreementMetadata, fetchAgreementTermsMetadata } from "../../../utils/metadata";
import { AgreementDataContext, AgreementDataContextType } from "./AgreementDataContext";
import { PositionMap, ResolverMap, Token, UserPosition } from "./types";

export const AgreementDataProvider = ({ id, children }: { id: string; children: ReactNode }) => {
	const { address: userAddress } = useAccount();
	const [title, setTitle] = useState<string>();
	const [status, setStatus] = useState<string>();
	const [fileName, setFileName] = useState<string>();
	const [fileStatus, setFileStatus] = useState<string>();
	const [termsFile, setTermsFile] = useState<string>();
	const [termsHash, setTermsHash] = useState<string>();
	const [metadataURI, setMetadataURI] = useState<string>();
	const [resolvers, setResolvers] = useState<ResolverMap>();
	const [positions, setPositions] = useState<PositionMap>();
	const [userPosition, setUserPosition] = useState<UserPosition>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isMetadataError, setIsMetadataError] = useState<boolean>(true);

	/* GET AGREEMENT DATA FROM CONTRACT */
	const { data: agreementData, positions: agreementPositions } = useAgreementData({
		id: id,
		enabled: id != "undefined",
	});

	const tokenAddress = useMemo(() => {
		return agreementData?.token;
	}, [agreementData]);

	const { amount: disputeAmount } = useDisputeConfig();

	const { data: tokenData } = useToken({
		address: tokenAddress,
		enabled: tokenAddress != undefined,
	});

	const depositToken = {
		name: "Nation3",
		symbol: "NATION",
		address: "0x333A4823466879eeF910A04D473505da62142069",
		decimals: 18,
	};

	const collateralToken = useMemo<Token | undefined>(() => {
		if (tokenData)
			return {
				name: tokenData.name,
				symbol: tokenData.symbol,
				decimals: tokenData.decimals,
				address: tokenData.address,
			};
	}, [tokenData]);

	const disputeCost = useMemo(() => {
		return disputeAmount ?? BigNumber.from(0);
	}, [disputeAmount]);

	/* Update state when fetched agreement params */
	// TODO:// REMOVE EFFECT, it does not need to keep active listening.
	useEffect(() => {
		console.log("$$$ AGREEMENT DATA =>", agreementData);

		/* TERMS HASH  */
		if (agreementData?.termsHash && agreementData.termsHash != termsHash) {
			setTermsHash(agreementData.termsHash);
		}

		/* GET THE AGREEMENT METADATA  */
		if (agreementData?.metadataURI) {
			setMetadataURI(agreementData.metadataURI);
			fetchAgreementMetadata(agreementData.metadataURI)
				.then((metadata) => {
					console.log("$$$ AGREEMENT METADATA =>", metadata);

					/* SET STATE CUSTOM TITLE */
					if (metadata.title && metadata.title != "Agreement") {
						if (metadata.title != title) setTitle(metadata.title);
					} else {
						/* SET DEFAULT TITLE */
						setTitle(`Agreement #${trimHash(id.toUpperCase())}`);
					}

					/* SET RESOLVERS POSITIONS TREE */
					if (metadata.resolvers) {
						setResolvers((prevResolvers) => ({ ...prevResolvers, ...metadata.resolvers }));
					}

					if (metadata.fileName) {
						setFileName(metadata.fileName);
					}

					if (metadata.fileStatus) {
						setFileStatus(metadata.fileStatus);
					}
					/* GET TERMS FILE URI */
					if (metadata.termsUri) {
						return fetchAgreementTermsMetadata(metadata.termsUri);
					}
				})
				/* SET TERMS FILE METADATA */
				.then((data: { fileTerms: string }) => {
					console.log("$$$ TERMS FILE =>", data);
					setTermsFile(data?.fileTerms);
				})
				.catch((err) => {
					console.log("METADA ERROR =>", err);
					setIsMetadataError(true);
				});
		}

		/* SET STATUS  */
		if (agreementData?.status && agreementData.status != status) {
			setStatus(agreementData.status);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
		if (agreementData.status) {
			setIsLoading(false);
		}
	}, [agreementData]);

	/* Update positions when fetched agreement positions or new resolvers */
	useEffect(() => {
		let knownPositions: {
			[key: string]: { party?: string; balance: string; status: number; deposit?: number };
		} = {};

		if (resolvers) {
			knownPositions = Object.entries(resolvers).reduce(
				(result, [account, { balance }]) => ({
					...result,
					[account.toString()]: {
						balance: balance,
						status: 0,
						deposit: 0,
					},
				}),
				knownPositions,
			);
		}

		if (agreementPositions) {
			knownPositions = agreementPositions.reduce(
				(result, [party, balance, deposit, status]) => ({
					...result,
					[party.toString()]: {
						balance: balance.toString(),
						status: status,
						deposit: deposit,
					},
				}),
				knownPositions,
			);
		}

		if (knownPositions != positions) {
			setPositions(knownPositions);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [agreementPositions, resolvers]);

	/* Update user position with agreement positions data */
	useEffect(() => {
		if (userAddress) {
			if (positions && positions[userAddress]) {
				setUserPosition((prevPosition) => ({ ...prevPosition, ...positions[userAddress] }));
			}
		} else {
			setUserPosition(undefined);
		}
	}, [userAddress, positions]);

	/* Update user position with agreement resolvers data */
	useEffect(() => {
		if (userAddress && resolvers && resolvers[userAddress]) {
			setUserPosition((prevPosition) => ({
				status: prevPosition?.status || 0,
				balance: prevPosition?.balance || resolvers[userAddress].balance,
				deposit: prevPosition?.deposit || 0,
				resolver: resolvers[userAddress],
			}));
		}
	}, [userAddress, resolvers]);

	const provider: AgreementDataContextType = {
		id,
		title,
		termsHash,
		collateralToken,
		depositToken,
		status,
		disputeCost,
		resolvers,
		positions,
		userPosition,
		isLoading,
		fileStatus,
		fileName,
		termsFile,
		isMetadataError,
	};

	return <AgreementDataContext.Provider value={provider}>{children}</AgreementDataContext.Provider>;
};
