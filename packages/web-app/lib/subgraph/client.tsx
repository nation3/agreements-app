// import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { GraphQLClient } from "graphql-request";
import getConstants from "../constants";

const graphqlClient = (chain: number) => {
	const { subgraphURI: endpoint } = getConstants(chain);
	if (!endpoint) {
		throw new Error("Subgraph endpoint not found");
	}
	return new GraphQLClient(endpoint);
};

export default graphqlClient;
