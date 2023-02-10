import { BigNumber } from "ethers";
import { ReactNode, useMemo, useState, useEffect } from "react";
import { useAgreementData } from "../../../hooks/useAgreement";
import { useAppealConfig, useResolution } from "../../../hooks/useArbitrator";
import { useResolutionProposals } from "../../../hooks/useCohort";
import { abiEncodingPacked, hashEncoding } from "../../../utils/hash";
import { fetchResolutionMetadata } from "../../../utils";
import { useConstants } from "../../../hooks/useConstants";

import {
	DisputeResolutionContext,
	DisputeResolutionContextType,
	Position,
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
	const { data, positions: agreementPositions } = useAgreementData({
		id,
		enabled: id != "undefined",
	});

	// const { amount } = useAppealConfig();

	const positions = useMemo(() => {
		return agreementPositions?.map(([party, balance]) => ({ party, balance }));
	}, [agreementPositions]);

	// TODO: Change on Next iteration
	const { appealCost } = useConstants();

	/* 	
	const appealCost = useMemo(() => {
		return amount ?? BigNumber.from(0);
	}, [amount]); 
	*/

	const balance = useMemo(() => {
		return agreementPositions?.reduce(
			(result, [, balance]) => result.add(balance),
			BigNumber.from(0),
		);
	}, [agreementPositions]);

	const resolutionId = useMemo(() => {
		if (id != "undefined" && data.status == "Disputed") {
			return hashEncoding(abiEncodingPacked(["address", "bytes32"], [framework, id]));
		} else {
			return "undefined";
		}
	}, [data, framework, id]);

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
		status: data?.status == "Disputed" ? "Open" : "Closed",
		termsHash: data?.termsHash,
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
