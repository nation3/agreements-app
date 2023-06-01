import { BigNumberish } from "ethers";

export interface Token {
	name: string;
	symbol: string;
	address: string;
}

export interface TokenDisplay extends Token {
	decimals: number;
	icon?: string;
}

export interface InputPosition {
	account: string;
	balance: BigNumberish;
}

export type InputPositionList = InputPosition[];
