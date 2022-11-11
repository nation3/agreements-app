import { BigNumber } from "ethers";

export type InputPosition = { account: string; balance: BigNumber };
export type InputPositionList = InputPosition[];

export enum CreateView {
	Form,
	Preview,
}
