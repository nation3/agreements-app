import { NextApiRequest, NextApiResponse } from "next";
import graphqlClient from "../../../lib/subgraph/client";
import { disputesQuery, DisputesData } from "../../../lib/subgraph/disputes";
import { GraphQLError } from "graphql";

const parseDisputes = (dispute: DisputesData["disputes"]) => {
	return dispute.map((dispute) => {
		return {
			id: dispute.id,
			createdAt: dispute.createdAt,
			status: dispute.settlement?.status || "Pending",
		};
	});
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { chain } = req.query;

	if (!chain) {
		return res.status(400).json({ message: "Chain id is required" });
	}

	try {
		const chainId = parseInt(chain as string);
		const data: DisputesData = await graphqlClient(chainId).request(disputesQuery);
		const disputes = parseDisputes(data.disputes);

		res.status(200).json(disputes);
	} catch (error) {
		if (error instanceof GraphQLError) {
			return res.status(400).json({ message: error.message });
		} else {
			return res.status(500).json({ message: "Internal server error on disputes fetching" });
		}
	}
}
