import { createContext, useContext } from "react";
import { PositionMap, ResolverMap } from "./types";

export type AgreementDataContextType = {
	id: string;
	status: string | undefined;
	title: string | undefined;
	termsHash: string | undefined;
	positions: PositionMap | undefined;
	resolvers: ResolverMap | undefined;
	setTitle: (title: string) => void | undefined;
};

export const AgreementDataContext = createContext<AgreementDataContextType | null>(null);

export const useAgreementData = (): AgreementDataContextType => {
	const context: AgreementDataContextType | null = useContext(AgreementDataContext);

	if (context === null) {
		throw new Error("You must add a <AgreementDataProvider> into the React tree");
	}

	return context;
};
