import { createContext, useContext } from "react";
import { AgreementList } from "./types";

export type AgreementListContextType = {
	agreements: AgreementList;
};

export const AgreementListContext = createContext<AgreementListContextType | null>(null);

export const useAgreementList = (): AgreementListContextType => {
	const context: AgreementListContextType | null = useContext(AgreementListContext);

	if (context === null) {
		throw new Error("You must add a <AgreementListProvider> into the React tree");
	}

	return context;
};
