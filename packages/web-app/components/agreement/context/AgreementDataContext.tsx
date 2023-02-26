import { createContext, useContext } from "react";
import { PositionMap, ResolverMap, UserPosition, Token } from "./types";
import { BigNumber } from "ethers";

export type AgreementDataContextType = {
	id: string;
	status: string | undefined;
	title: string | undefined;
	termsHash: string | undefined;
	collateralToken: Token | undefined;
	depositToken: Token | undefined;
	positions: PositionMap | undefined;
	resolvers: ResolverMap | undefined;
	disputeCost: BigNumber;
	userPosition: UserPosition | undefined;
};

export const AgreementDataContext = createContext<AgreementDataContextType | null>(null);

export const useAgreementData = (): AgreementDataContextType => {
	const context: AgreementDataContextType | null = useContext(AgreementDataContext);

	if (context === null) {
		throw new Error("You must add a <AgreementDataProvider> into the React tree");
	}

	return context;
};
