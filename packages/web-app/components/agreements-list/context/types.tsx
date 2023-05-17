export interface Agreement {
	id: string;
	title?: string;
	createdAt: string;
	userBalance: string;
	status: string;
}

export type AgreementList = Agreement[];
