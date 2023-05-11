export interface PositionParams {
	status: string;
	collateral: string;
}

export interface ResolverParams {
	balance: string;
	proof: string[];
}

export interface UserPosition {
	status: string;
	deposit: string;
	collateral: string;
	resolver?: ResolverParams;
}

export interface Token {
	name: string;
	symbol: string;
	decimals: number;
	address: string;
}

export type PositionMap = { [address: string]: PositionParams };
export type ResolverMap = { [address: string]: ResolverParams };
