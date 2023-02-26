import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export type SubgraphClient = ApolloClient<InMemoryCache>;

// TODO: Move subgraph queries to proxy API to avoid exposing subgraph api key
export const client = (uri: string) => {
	return new ApolloClient({
		uri: uri,
		cache: new InMemoryCache(),
	});
};

export interface AgreementPositionsData {
	agreementPositions: {
		party: string;
		balance: string;
		agreement: {
			id: string;
			createdAt: string;
			status: string;
		};
	}[];
}

export interface DisputesData {
	disputes: {
		id: string;
		createdAt: string;
		settlement: {
			status: string;
		} | null;
	}[];
}

export const agreementsPositionsQuery = gql`
	query GetUserAgreements($account: Bytes!) {
		agreementPositions(where: { party: $account }) {
			party
			balance
			agreement {
				id
				createdAt
				status
			}
		}
	}
`;

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
