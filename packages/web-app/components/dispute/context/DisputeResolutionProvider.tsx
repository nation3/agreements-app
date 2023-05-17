import { BigNumber } from "ethers";
import { ReactNode, useMemo, useState, useEffect } from "react";
import { useAgreement as useAgreementOnChain } from "../../../hooks/useAgreement";
import { useResolution } from "../../../hooks/useArbitrator";
import { useResolutionProposals } from "../../../hooks/useCohort";
import { abiEncodingPacked, hashEncoding } from "../../../utils/hash";
import { fetchResolutionMetadata } from "../../../utils";
import { useConstants } from "../../../hooks/useConstants";
import { useToken } from "wagmi";

import {
	DisputeResolutionContext,
	DisputeResolutionContextType,
	Position,
	Token,
} from "./DisputeResolutionContext";

export const DisputeResolutionProvider = ({
	framework,
	id,
	children,
}: {
	framework: string;
	id: string;
	children: ReactNode;
}) => {
	const { agreement } = useAgreementOnChain({
		id,
		enabled: id != "undefined",
	});

	// const { amount } = useAppealConfig();

	const tokenAddress = useMemo(() => {
		return agreement?.token;
	}, [agreement]);

	const { data: tokenData } = useToken({
		address: tokenAddress,
		enabled: tokenAddress != undefined,
	});

	const collateralToken = useMemo<Token | undefined>(() => {
		if (tokenData)
			return {
				name: tokenData.name,
				symbol: tokenData.symbol,
				decimals: tokenData.decimals,
				address: tokenData.address,
			};
	}, [tokenData]);

	const positions = useMemo(() => {
		const activePositions = agreement?.positions;
		activePositions?.filter(({ status }) => status != "Pending");
		return activePositions?.map(({ party, collateral }) => ({
			party,
			balance: BigNumber.from(collateral),
		}));
	}, [agreement]);

	// TODO: Change on Next iteration
	const { appealCost } = useConstants();

	/* 	
	const appealCost = useMemo(() => {
		return amount ?? BigNumber.from(0);
	}, [amount]); 
	*/

	const balance = useMemo(() => {
		return positions?.reduce((result, { balance }) => result.add(balance), BigNumber.from(0));
	}, [positions]);

	const resolutionId = useMemo(() => {
		if (id != "undefined" && agreement?.status == "Disputed") {
			return hashEncoding(abiEncodingPacked(["address", "bytes32"], [framework, id]));
		} else {
			return "undefined";
		}
	}, [agreement, framework, id]);

	const { resolution: resolutionData } = useResolution({
		id: resolutionId,
		enabled: resolutionId != "undefined",
	});
	const [settlement, setSettlement] = useState<Position[]>();
	const [metadataURI, setMetadataURI] = useState<string>();

	useEffect(() => {
		if (resolutionData?.metadataURI && resolutionData.metadataURI != metadataURI) {
			setMetadataURI(resolutionData.metadataURI);
			fetchResolutionMetadata(resolutionData.metadataURI).then((metadata) => {
				setSettlement(
					metadata.settlement.map(({ party, balance }) => ({
						party,
						balance: BigNumber.from(balance),
					})),
				);
			});
		}
	}, [resolutionData?.metadataURI, metadataURI]);

	const dispute = {
		id,
		status: agreement?.status == "Disputed" ? "Open" : "Closed",
		termsHash: agreement?.termsHash,
		collateralToken: collateralToken,
		balance,
		positions,
	};

	const resolution = useMemo(() => {
		if (resolutionData && settlement) {
			return {
				id: resolutionId,
				status: resolutionData?.status,
				mark: resolutionData?.settlement,
				unlockTime: resolutionData?.unlockTime,
				settlement: settlement,
			};
		}
	}, [resolutionId, resolutionData, settlement]);

	const { proposals } = useResolutionProposals({ id });

	const provider: DisputeResolutionContextType = {
		dispute,
		resolution,
		appealCost,
		proposedResolutions: proposals ?? [],
	};

	return (
		<DisputeResolutionContext.Provider value={provider}>
			{children}
		</DisputeResolutionContext.Provider>
	);
};
