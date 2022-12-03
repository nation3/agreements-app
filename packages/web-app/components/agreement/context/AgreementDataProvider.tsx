import { ReactNode, useState, useEffect } from "react";

import { AgreementDataContext, AgreementDataContextType } from "./AgreementDataContext";
import { ResolverMap, PositionMap } from "./types";
import { useAgreementRead } from "../../../hooks/useAgreement";
import { fetchAgreementMetadata } from "../../../utils/metadata";

export const AgreementDataProvider = ({ id, children }: { id: string; children: ReactNode }) => {
	const [title, setTitle] = useState("Agreement");
	const [termsHash, setTermsHash] = useState<string>();
	const [metadataURI, setMetadataURI] = useState<string>();
	const [resolvers, setResolvers] = useState<ResolverMap>();
	const [positions, setPositions] = useState<PositionMap>();

	const {
		params: agreementParams,
		positions: agreementPositions,
		status,
	} = useAgreementRead({ id: id, enabled: id != "undefined" });

	/* Update state when fetched agreement params */
	useEffect(() => {
		if (agreementParams?.termsHash && agreementParams.termsHash != termsHash) {
			setTermsHash(agreementParams.termsHash);
		}
		if (agreementParams?.metadataURI && agreementParams.metadataURI != metadataURI) {
			setMetadataURI(agreementParams.metadataURI);
			fetchAgreementMetadata(agreementParams.metadataURI).then((metadata) => {
				if (metadata.title && metadata.title != title) setTitle(metadata.title);
				if (metadata.resolvers)
					setResolvers((prevResolvers) => ({ ...prevResolvers, ...metadata.resolvers }));
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [agreementParams]);

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

	const provider: AgreementDataContextType = {
		id,
		status,
		title,
		termsHash,
		resolvers,
		positions,
	};

	return <AgreementDataContext.Provider value={provider}>{children}</AgreementDataContext.Provider>;
};
