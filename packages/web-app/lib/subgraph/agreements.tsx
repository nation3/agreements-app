import { gql } from "graphql-request";

export interface AgreementPositionsData {
	agreementPositions: {
		party: string;
		collateral: string;
		status: string;
		agreement: {
			id: string;
			metadataURI: string;
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
				createdAt
				status
				token
			}
		}
	}
`;
