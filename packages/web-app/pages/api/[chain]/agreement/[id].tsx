import { NextApiRequest, NextApiResponse } from "next";
import subgraphClient from "../../../../lib/subgraph/client";
import { agreementQuery, AgreementData } from "../../../../lib/subgraph/agreement";
import { GraphQLError } from "graphql";
import { IPFSUriToUrl } from "../../../../lib/ipfs";
import { AgreementWithPositions, AgreementPosition } from "../../../../lib/types";
import { parseAgreementMetadata, ResolverMap } from "../../../../utils";
import { getAddress } from "ethers/lib/utils";

const normalizeAddress = (address: string): string => {
	try {
		const checksumed = getAddress(address);
		return checksumed;
	} catch (error) {
		return address;
	}
};

const parseAgreementDataToAgreement = (agreementData: AgreementData): AgreementWithPositions => {
	return {
		id: agreementData.agreement.id,
		termsHash: agreementData.agreement.termsHash,
		metadataURI: agreementData.agreement.metadataURI,
		status: agreementData.agreement.status,
		title: "Agreement",
		token: agreementData.agreement.token,
		framework: agreementData.agreement.framework.id,
		createdAt: agreementData.agreement.createdAt,
		termsPrivacy: "private",
		termsURI: undefined,
		termsFilename: undefined,
		positions: agreementData.agreement.positions.map((position) => {
			return {
				party: normalizeAddress(position.party),
				collateral: position.collateral,
				deposit: position.deposit,
				status: position.status,
			};
		}),
	};
};

const combinePositions = (
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

const feedAgreementWithMetadata = async (
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { chain, id } = req.query;

	if (!chain) {
		return res.status(400).json({ message: "Chain id is required" });
	}
	if (!id) {
		return res.status(400).json({ message: "Agreement id is required" });
	}

	try {
		const chainId = parseInt(chain as string);
		const data: AgreementData = await subgraphClient(chainId).request(agreementQuery, {
			id,
		});
		const agreement = parseAgreementDataToAgreement(data);
		const fedAgreement = await feedAgreementWithMetadata(agreement);
		return res.status(200).json(fedAgreement);
	} catch (error) {
		console.log(error);
		if (error instanceof GraphQLError) {
			return res.status(400).json({ message: error.message });
		} else {
			return res.status(500).json({ message: "Internal server error on agreement fetching" });
		}
	}
}
