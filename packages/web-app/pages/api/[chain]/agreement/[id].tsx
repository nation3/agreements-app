import { NextApiRequest, NextApiResponse } from "next";
import subgraphClient from "../../../../lib/subgraph/client";
import { agreementQuery, AgreementData } from "../../../../lib/subgraph/agreement";
import { GraphQLError } from "graphql";
import { IPFSUriToUrl } from "../../../../lib/ipfs";
import { AgreementWithPositions } from "../../../../lib/types";
import { feedAgreementWithMetadata, normalizeAddress } from "../../../../utils";

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
