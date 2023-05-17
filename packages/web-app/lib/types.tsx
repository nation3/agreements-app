export interface AgreementBase {
	id: string;
	termsHash: string;
	metadataURI: string;
	status: string;
}

export interface Agreement extends AgreementBase {
	title: string;
	token: string;
	framework: string;
	createdAt: string;
	termsPrivacy: string;
	termsURI?: string;
	termsFilename?: string;
}

export interface AgreementPosition {
	party: string;
	collateral: string;
	deposit: string;
	status: string;
	resolver?: {
		balance: string;
		proof: string[];
	};
}

export interface AgreementWithPositions extends Agreement {
	positions: AgreementPosition[];
}
