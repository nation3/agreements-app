import { createContext, useContext } from "react";
import { BigNumber } from "ethers";

export type Position = { party: string; balance: BigNumber };

export type Dispute = {
	id: string;
	termsHash: string | undefined;
	balance: BigNumber | undefined;
	positions: Position[] | undefined;
};

export type Resolution = {
	id: string;
	status: string;
	mark: string;
	unlockBlock: number;
	settlement: Position[] | undefined;
};

export type DisputeResolutionContextType = {
	dispute: Dispute;
	resolution: Resolution | undefined;
};

export const DisputeResolutionContext = createContext<DisputeResolutionContextType | null>(null);

export const useDispute = (): DisputeResolutionContextType => {
	const context: DisputeResolutionContextType | null = useContext(DisputeResolutionContext);

	if (context === null) {
		throw new Error("You must add a <DisputeResolutionProvider> into the React tree");
	}

	return context;
};
