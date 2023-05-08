import { createContext, useContext } from "react";
import { CreateView, InputPositionList, Token } from "./types";

export type AgreementCreationContextType = {
	view: CreateView;
	salt: string;
	title: string;
	terms: string;
	termsHash: string;
	fileName: string;
	fileStatus: string;
	filePass?: string;
	token: Token;
	id: string;
	positions: InputPositionList;
	changeView: (view: CreateView) => void;
	setTitle: (text: string) => void;
	setTerms: (text: string) => void;
	setFilePass: (text: string) => void;
	setFileStatus: (text: string) => void;
	setFileName: (text: string) => void;
	setToken: (token: Token) => void;
	setPositions: (positions: InputPositionList) => void;
};

export const AgreementCreationContext = createContext<AgreementCreationContextType | null>(null);

export const useAgreementCreation = (): AgreementCreationContextType => {
	const context: AgreementCreationContextType | null = useContext(AgreementCreationContext);

	if (context === null) {
		throw new Error("You must add a <AgreementCreationProvider> into the React tree");
	}

	return context;
};
