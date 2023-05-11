import { NextApiRequest, NextApiResponse } from "next";
import subgraphClient from "../../../../lib/subgraph/client";
import {
	agreementsPositionsQuery,
	AgreementPositionsData,
} from "../../../../lib/subgraph/agreements";
import { GraphQLError } from "graphql";
import { IPFSUriToUrl } from "../../../../lib/ipfs";
import { Agreement } from "../../../../lib/types";

type AgreementEntry = Pick<
	Agreement,
	"id" | "metadataURI" | "status" | "title" | "token" | "createdAt"
>;

const feedAgreementsWithMetadata = async (agreements: AgreementEntry[]) => {
	return Promise.all(
		agreements.map(async (agreement) => {
			try {
				const url = IPFSUriToUrl(agreement.metadataURI);
				const response = await fetch(url);
				if (response.ok) {
					const metadata = await response.json();
					return {
						...agreement,
						title: metadata.title,
					};
				}
			} catch (error) {
				console.log(error);
			}
			return agreement;
		}),
	);
};

const parseAgreementPositionsToAgreements = (
	agreementPositions: AgreementPositionsData["agreementPositions"],
): AgreementEntry[] => {
	return agreementPositions.map((agreementPosition) => {
		return {
			id: agreementPosition.agreement.id,
			metadataURI: agreementPosition.agreement.metadataURI,
			status: agreementPosition.agreement.status,
			token: agreementPosition.agreement.token,
			createdAt: agreementPosition.agreement.createdAt,
			title: "Agreement",
		};
	});
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { chain, account } = req.query;

	if (!chain) {
		return res.status(400).json({ message: "Chain id is required" });
	}
	if (!account) {
		return res.status(400).json({ message: "Account address is required" });
	}

	try {
		const chainId = parseInt(chain as string);
		const data: AgreementPositionsData = await subgraphClient(chainId).request(
			agreementsPositionsQuery,
			{
				account,
			},
		);
		const agreements = parseAgreementPositionsToAgreements(data.agreementPositions);
		const agreementsWithMetadata = await feedAgreementsWithMetadata(agreements);
		return res.status(200).json(agreementsWithMetadata);
	} catch (error) {
		console.log(error);
		if (error instanceof GraphQLError) {
			return res.status(400).json({ message: error.message });
		} else {
			return res.status(500).json({ message: "Internal server error on agreements fetching" });
		}
	}
}
