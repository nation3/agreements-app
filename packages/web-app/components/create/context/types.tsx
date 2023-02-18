import { BigNumber } from "ethers";

export type InputPosition = { account: string; balance: BigNumber };
export type InputPositionList = InputPosition[];

export interface Token {
	name: string;
	symbol: string;
	address: string;
	decimals: number;
	icon?: string;
}

export enum CreateView {
	Form,
	Preview,
}
