import { useMemo } from "react";
import { useNetwork } from "wagmi";

interface Token {
	name: string;
	symbol: string;
	address: string;
	decimals: number;
}

const mainnetTokens = [
	{
		name: "Nation3",
		symbol: "NATION",
		address: "0x333A4823466879eeF910A04D473505da62142069",
		decimals: 18,
	},
	{
		name: "Wrapped Ether",
		symbol: "WETH",
		address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
		decimals: 18,
	},
	{
		name: "Dai Stablecoin",
		symbol: "DAI",
		address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
		decimals: 18,
	},
	{
		name: "Aragon Network Token",
		symbol: "ANT",
		address: "0xa117000000f279D81A1D3cc75430fAA017FA5A2e",
		decimals: 18,
	},
];

const goerliTokens = [
	{
		name: "Nation3",
		symbol: "NATION",
		address: "0x333A4823466879eeF910A04D473505da62142069",
		decimals: 18,
	},
	{
		name: "Wrapped Ether",
		symbol: "WETH",
		address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
		decimals: 18,
	},
];

export const useTokenList = (): Token[] => {
	const { chain } = useNetwork();

	const tokens = useMemo(() => {
		switch (chain?.id) {
			case 1:
				return mainnetTokens;
			case 5:
				return goerliTokens;
			default:
				return mainnetTokens;
		}
	}, [chain]);

	return tokens;
};
