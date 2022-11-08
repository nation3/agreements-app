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
	resolver?: ResolverParams;
}

export type PositionMap = { [address: string]: PositionParams };
export type ResolverMap = { [address: string]: ResolverParams };
