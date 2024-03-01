import { BigNumber } from "ethers";
import * as mainnet from "./mainnet";

export { mainnet };

export interface Constants {
	permit2Address: `0x${string}`;
	NATION: `0x${string}`;
	frameworkAddress: `0x${string}`;
	arbitratorAddress: `0x${string}`;
	cohortAddress: `0x${string}`;
	safeTxServiceUrl: string;
	subgraphURI: string | undefined;
	appealCost: BigNumber | undefined;
}

const constants = (chainId: number) => {
	switch (chainId) {
		case 1:
			return { ...mainnet };
		default:
			return { ...mainnet };
	}
};

export default constants;
