import { gql } from "graphql-request";

export interface AgreementData {
	agreement: {
		id: string;
		framework: {
			id: string;
		};
		termsHash: string;
		criteria: string;
		status: string;
		token: string;
		metadataURI: string;
		createdAt: string;
		positions: {
			party: string;
			collateral: string;
			deposit: string;
			status: string;
		}[];
	};
}

export const agreementQuery = gql`
	query GetAgreement($id: String!) {
		agreement(id: $id) {
			id
			framework {
				id
			}
			termsHash
			criteria
			status
			token
			metadataURI
			createdAt
			positions {
				party
				collateral
				deposit
				status
			}
		}
	}
`;
