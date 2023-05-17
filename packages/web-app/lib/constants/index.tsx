import { BigNumber } from "ethers";
import * as mainnet from "./mainnet";
import * as goerli from "./goerli";
import * as gnosis from "./gnosis";

export { mainnet, goerli };

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
		case 100:
			return { ...gnosis };
		default:
			return { ...mainnet };
	}
};

export default constants;
