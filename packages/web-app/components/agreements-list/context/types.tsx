export interface Agreement {
	id: string;
	createdAt: string;
	userBalance: string;
	status: string;
	title: string | undefined;
}

export type AgreementList = Agreement[];
