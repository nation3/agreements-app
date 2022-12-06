export interface Agreement {
	id: string;
	createdAt: string;
	userBalance: string;
	status: string;
}

export type AgreementList = Agreement[];
