import { createContext, useContext } from "react";
import { BigNumber } from "ethers";
import { ResolutionProposal } from "../../../hooks/useCohort";

export type Position = { party: string; balance: BigNumber };
export interface Token {
	name: string;
	symbol: string;
	decimals: number;
	address: string;
}

export type Dispute = {
	id: string;
	status: string;
	termsHash: string | undefined;
	collateralToken: Token | undefined;
	balance: BigNumber | undefined;
	positions: Position[] | undefined;
};

export type Resolution = {
	id: string;
	status: string;
	mark: string;
	unlockTime: number;
	settlement: Position[] | undefined;
};

export type DisputeResolutionContextType = {
	dispute: Dispute;
	appealCost: BigNumber | undefined;
	resolution: Resolution | undefined;
	proposedResolutions: ResolutionProposal[];
};

export const DisputeResolutionContext = createContext<DisputeResolutionContextType | null>(null);

export const useDispute = (): DisputeResolutionContextType => {
	const context: DisputeResolutionContextType | null = useContext(DisputeResolutionContext);

	if (context === null) {
		throw new Error("You must add a <DisputeResolutionProvider> into the React tree");
	}

	return context;
};
