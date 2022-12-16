import { BigNumber } from "ethers";
import { ReactNode, useMemo, useState, useEffect } from "react";
import { useAgreementRead } from "../../../hooks/useAgreement";
import { useResolution } from "../../../hooks/useArbitrator";
import { useResolutionProposals } from "../../../hooks/useCohort";
import { abiEncodingPacked, hashEncoding } from "../../../utils/hash";
import { fetchResolutionMetadata } from "../../../utils";

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
	const {
		params,
		status: agreementStatus,
		positions: agreementPositions,
	} = useAgreementRead({ id, enabled: id != "undefined" });

	const positions = useMemo(() => {
		return agreementPositions?.map(([party, balance]) => ({ party, balance }));
	}, [agreementPositions]);

	const balance = useMemo(() => {
		return agreementPositions?.reduce(
			(result, [, balance]) => result.add(balance),
			BigNumber.from(0),
		);
	}, [agreementPositions]);

	const resolutionId = useMemo(() => {
		if (id != "undefined" && agreementStatus == "Disputed") {
			return hashEncoding(abiEncodingPacked(["address", "bytes32"], [framework, id]));
		} else {
			return "undefined";
		}
	}, [agreementStatus, framework, id]);

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
		termsHash: params?.termsHash,
		balance,
		positions,
	};

	const resolution = useMemo(() => {
		if (resolutionData && settlement) {
			return {
				id: resolutionId,
				status: resolutionData?.status,
				mark: resolutionData?.mark,
				unlockBlock: resolutionData?.unlockBlock,
				settlement: settlement,
			};
		}
	}, [resolutionId, resolutionData, settlement]);

	const { proposals } = useResolutionProposals({ id });

	const provider: DisputeResolutionContextType = {
		dispute,
		resolution,
		proposedResolutions: proposals ?? [],
	};

	return (
		<DisputeResolutionContext.Provider value={provider}>
			{children}
		</DisputeResolutionContext.Provider>
	);
};
