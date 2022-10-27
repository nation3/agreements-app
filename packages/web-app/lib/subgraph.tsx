import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export type SubgraphClient = ApolloClient<InMemoryCache>;

// TODO: Move subgraph queries to proxy API to avoid exposing subgraph api key

export const client = new ApolloClient({
	uri: process.env.NEXT_PUBLIC_GRAPH_API_URL,
	cache: new InMemoryCache(),
});

export interface AgreementPositionsData {
	agreementPositions: {
		party: string;
		balance: string;
		agreement: {
			id: string;
			status: string;
		};
	}[];
}

export const agreementsPositionsQuery = gql`
	query GetUserAgreements($account: Bytes!) {
		agreementPositions(where: { party: $account }) {
			party
			balance
			agreement {
				id
				status
			}
		}
	}
`;
