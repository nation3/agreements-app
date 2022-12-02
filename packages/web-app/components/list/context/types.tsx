export interface Agreement {
	id: string;
	termsHash: string;
	criteria: string;
	status: string;
	title: string;
}

export type AgreementList = Agreement[];
