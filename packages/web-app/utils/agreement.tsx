import { AgreementPosition, AgreementWithPositions } from "../lib/types";
import { parseAgreementMetadata } from "./metadata";
import { IPFSUriToUrl } from "./ipfs";
import { ResolverMap } from "./criteria";
import { getAddress } from "ethers/lib/utils";

export const normalizeAddress = (address: string): string => {
	try {
		const checksumed = getAddress(address);
		return checksumed;
	} catch (error) {
		return address;
	}
};

export const combinePositions = (
	positions: AgreementPosition[],
	resolvers: ResolverMap | undefined,
): AgreementPosition[] => {
	if (!resolvers) {
		return positions;
	}
	const pendingPositions = Object.entries(resolvers).map(([party, resolver]) => {
		return {
			party: normalizeAddress(party),
			collateral: resolver.balance,
			deposit: "0",
			status: "Pending",
			resolver: {
				balance: resolver.balance,
				proof: resolver.proof,
			},
		};
	});
	// Combine pending positions with positions from the agreement, agreement positions override pending positions
	const combinedPositions = pendingPositions.map((pendingPosition) => {
		const agreementPosition = positions.find(
			(position) => position.party === pendingPosition.party,
		);
		if (agreementPosition) {
			return {
				...agreementPosition,
				resolver: pendingPosition.resolver,
			};
		}
		return pendingPosition;
	});
	return combinedPositions;
};

export const feedAgreementWithMetadata = async (
	agreement: AgreementWithPositions,
): Promise<AgreementWithPositions> => {
	try {
		const url = IPFSUriToUrl(agreement.metadataURI);
		const response = await fetch(url);
		if (response.ok) {
			const raw = await response.json();
			const metadata = parseAgreementMetadata(raw);
			const combinedPositions = combinePositions(agreement.positions, metadata.resolvers);
			return {
				...agreement,
				title: metadata.title || agreement.title,
				termsPrivacy: metadata.termsPrivacy || "private",
				termsURI: metadata.termsURI || undefined,
				termsFilename: metadata.termsFilename || undefined,
				positions: combinedPositions,
			};
		}
	} catch (error) {
		console.log(error);
	}
	return agreement;
};
