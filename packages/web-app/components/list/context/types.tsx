export interface Agreement {
	id: string;
	termsHash: string;
	criteria: string;
	status: string;
}

export type AgreementList = Agreement[];
