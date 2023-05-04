import { BigNumber } from "ethers";
import { createContext, useContext } from "react";
import { PositionMap, ResolverMap, Token, UserPosition } from "./types";

export type AgreementDataContextType = {
	id: string;
	isLoading: boolean;
	status: string | undefined;
	title: string | undefined;
	termsHash: string | undefined;
	collateralToken: Token | undefined;
	depositToken: Token | undefined;
	positions: PositionMap | undefined;
	resolvers: ResolverMap | undefined;
	disputeCost: BigNumber;
	userPosition: UserPosition | undefined;
	fileStatus: string | undefined;
	fileName: string | undefined;
	termsFile: string | undefined;
	isMetadataError: boolean;
};

export const AgreementDataContext = createContext<AgreementDataContextType | null>(null);

export const useAgreementData = (): AgreementDataContextType => {
	const context: AgreementDataContextType | null = useContext(AgreementDataContext);

	if (context === null) {
		throw new Error("You must add a <AgreementDataProvider> into the React tree");
	}

	return context;
};
