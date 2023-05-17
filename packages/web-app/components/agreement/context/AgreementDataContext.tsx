import { BigNumber } from "ethers";
import { createContext, useContext } from "react";
import { Token, UserPosition } from "./types";
import { AgreementPosition } from "../../../lib/types";

export interface AgreementParams {
	id: string;
	title: string | undefined;
	status: string | undefined;
	termsHash: string | undefined;
}

export type AgreementDataContextType = AgreementParams & {
	isLoading: boolean;
	collateralToken: Token | undefined;
	depositToken: Token | undefined;
	positions: AgreementPosition[] | undefined;
	disputeCost: BigNumber;
	userPosition: UserPosition | undefined;
	fileStatus: string | undefined;
	fileName: string | undefined;
	termsFile: string | undefined;
};

export const AgreementDataContext = createContext<AgreementDataContextType | null>(null);

export const useAgreementData = (): AgreementDataContextType => {
	const context: AgreementDataContextType | null = useContext(AgreementDataContext);

	if (context === null) {
		throw new Error("You must add a <AgreementDataProvider> into the React tree");
	}

	return context;
};
