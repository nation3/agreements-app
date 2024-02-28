import { BigNumber } from "ethers";
import * as mainnet from "./mainnet";
import * as goerli from "./goerli";
import * as gnosis from "./gnosis";
import * as sepolia from "./sepolia";

export { mainnet, goerli, sepolia };

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
		case 5:
			return { ...goerli };
		case 11155111:
			return { ...sepolia };
		case 100:
			return { ...gnosis };
		default:
			return { ...mainnet };
	}
};

export default constants;
