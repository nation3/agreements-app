export interface Agreement {
	id: string;
	termsHash: string;
	criteria: string;
	status: string;
	createdAt: number;
}

export type AgreementList = Agreement[];
