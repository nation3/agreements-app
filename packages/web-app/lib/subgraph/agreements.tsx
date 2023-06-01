import { gql } from "graphql-request";

export interface AgreementPositionsData {
	agreementPositions: {
		party: string;
		collateral: string;
		status: string;
		agreement: {
			id: string;
			metadataURI: string;
			termsHash: string;
			createdAt: string;
			status: string;
			token: string;
		};
	}[];
}

export const agreementsPositionsQuery = gql`
	query GetUserAgreements($account: Bytes!) {
		agreementPositions(where: { party: $account }) {
			party
			collateral
			status
			agreement {
				id
				metadataURI
				termsHash
				createdAt
				status
				token
			}
		}
	}
`;
