import { ReactNode, useState, useEffect, useMemo } from "react";

import { AgreementDataContext, AgreementDataContextType } from "./AgreementDataContext";
import { ResolverMap, PositionMap, UserPosition } from "./types";
import { useAgreementData, useDisputeConfig } from "../../../hooks/useAgreement";
import { fetchAgreementMetadata } from "../../../utils/metadata";
import { trimHash } from "../../../utils/hash";
import { useAccount } from "wagmi";
import { BigNumber } from "ethers";

export const AgreementDataProvider = ({ id, children }: { id: string; children: ReactNode }) => {
	const { address: userAddress } = useAccount();
	const [title, setTitle] = useState<string>();
	const [status, setStatus] = useState<string>();
	const [termsHash, setTermsHash] = useState<string>();
	const [metadataURI, setMetadataURI] = useState<string>();
	const [resolvers, setResolvers] = useState<ResolverMap>();
	const [positions, setPositions] = useState<PositionMap>();
	const [userPosition, setUserPosition] = useState<UserPosition>();

	const { data: agreementData, positions: agreementPositions } = useAgreementData({
		id: id,
		enabled: id != "undefined",
	});

	const { amount: disputeAmount } = useDisputeConfig();

	const disputeCost = useMemo(() => {
		return disputeAmount ?? BigNumber.from(0);
	}, [disputeAmount]);

	/* Update state when fetched agreement params */
	useEffect(() => {
		if (agreementData?.termsHash && agreementData.termsHash != termsHash) {
			setTermsHash(agreementData.termsHash);
		}
		if (agreementData?.metadataURI && agreementData.metadataURI != metadataURI) {
			setMetadataURI(agreementData.metadataURI);
			fetchAgreementMetadata(agreementData.metadataURI).then((metadata) => {
				if (metadata.title && metadata.title != "Agreement") {
					if (metadata.title != title) setTitle(metadata.title);
				} else {
					setTitle(`Agreement #${trimHash(id.toUpperCase())}`);
				}
				if (metadata.resolvers)
					setResolvers((prevResolvers) => ({ ...prevResolvers, ...metadata.resolvers }));
			});
		}
		if (agreementData?.status && agreementData.status != status) {
			setStatus(agreementData.status);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [agreementData]);

	/* Update positions when fetched agreement positions or new resolvers */
	useEffect(() => {
		let knownPositions: { [key: string]: { balance: string; status: number } } = {};
		if (resolvers) {
			knownPositions = Object.entries(resolvers).reduce(
				(result, [account, { balance }]) => ({
					...result,
					[account.toString()]: {
						balance: balance,
						status: 0,
					},
				}),
				knownPositions,
			);
		}
		if (agreementPositions) {
			knownPositions = agreementPositions.reduce(
				(result, [party, balance, status]) => ({
					...result,
					[party.toString()]: {
						balance: balance.toString(),
						status: status,
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
				resolver: resolvers[userAddress],
			}));
		}
	}, [userAddress, resolvers]);

	const provider: AgreementDataContextType = {
		id,
		title,
		termsHash,
		status,
		disputeCost,
		resolvers,
		positions,
		userPosition,
	};

	return <AgreementDataContext.Provider value={provider}>{children}</AgreementDataContext.Provider>;
};
