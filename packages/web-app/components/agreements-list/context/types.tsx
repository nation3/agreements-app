export interface Agreement {
	id: string;
	createdAt: string;
	userBalance: string;
	status: string;
	title: string;
}

export type AgreementList = Agreement[];
