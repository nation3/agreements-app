export interface Agreement {
	id: string;
	title?: string;
	termsHash: string;
	createdAt: string;
	userBalance: string;
	status: string;
}

export type AgreementList = Agreement[];
