import { createContext, useContext } from "react";
import { DisputeList } from "./types";

export type DisputeListContextType = {
	disputes: DisputeList;
};

export const DisputeListContext = createContext<DisputeListContextType | null>(null);

export const useDisputeList = (): DisputeListContextType => {
	const context: DisputeListContextType | null = useContext(DisputeListContext);

	if (context === null) {
		throw new Error("You must add a <AgreementListProvider> into the React tree");
	}

	return context;
};
