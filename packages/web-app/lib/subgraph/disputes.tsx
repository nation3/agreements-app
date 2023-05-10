import { gql } from "graphql-request";

export interface DisputesData {
	disputes: {
		id: string;
		createdAt: string;
		settlement: {
			status: string;
		} | null;
	}[];
}

export const disputesQuery = gql`
	query GetOpenDisputes {
		disputes {
			id
			createdAt
			settlement {
				status
			}
		}
	}
`;
