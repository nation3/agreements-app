export interface PositionParams {
	status: number;
	balance: string;
}

export interface ResolverParams {
	balance: string;
	proof: string[];
}

export interface UserPosition {
	status: number;
	balance: string;
	deposit?: number | undefined;
	resolver?: ResolverParams;
}

export interface Token {
	name: string;
	symbol: string;
	decimals: number;
	address: string;
};

export type PositionMap = { [address: string]: PositionParams };
export type ResolverMap = { [address: string]: ResolverParams };
