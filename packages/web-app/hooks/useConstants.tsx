import { useMemo } from "react";
import * as goerli from "../lib/constants-goerli";
import * as mainnet from "../lib/constants";
import { useNetwork } from "wagmi";

export interface constants {
	permit2Address: `0x${string}`;
	NATION: `0x${string}`;
	frameworkAddress: `0x${string}`;
	arbitratorAddress: `0x${string}`;
	cohortAddress: `0x${string}`;
	safeTxServiceUrl: string;
	subGraphUrl: string | undefined;
}

export const useConstants = (): constants => {
	const { chain } = useNetwork();

	const constants = useMemo(() => {
		switch (chain?.id) {
			case 1:
				return { ...mainnet };
			case 5:
				return { ...goerli };
			default:
				return { ...mainnet };
		}
	}, [chain]);

	return constants;
};
