import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { providers } from "ethers";
import { Chain, configureChains } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

type FallbackProviderConfig = Omit<providers.FallbackProviderConfig, "provider">;

const customAlchemyProvider = ({ priority, stallTimeout, weight }: FallbackProviderConfig) => {
	return (chain: Chain) => {
		let apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
		if (!apiKey || !chain.rpcUrls.alchemy) return null;

		return {
			chain: {
				...chain,
				rpcUrls: {
					...chain.rpcUrls,
					default: `${chain.rpcUrls.alchemy}/${apiKey}`,
				},
			} as Chain,
			provider: () => {
				const provider = new providers.AlchemyProvider(
					{
						chainId: chain.id,
						name: chain.network,
						ensAddress: chain.ens?.address,
					},
					apiKey,
				);
				return Object.assign(provider, { priority, stallTimeout, weight });
			},
			webSocketProvider: () =>
				new providers.AlchemyWebSocketProvider(
					{
						chainId: chain.id,
						name: chain.network,
						ensAddress: chain.ens?.address,
					},
					apiKey,
				),
		};
	};
};

export const providersToUse = () => {
	const providers = [customAlchemyProvider({ priority: 0 }), publicProvider({ priority: 1 })];
	return providers;
};

export const chainsToUse = () => {
	return [mainnet, sepolia];
};

export const { chains, provider, webSocketProvider } = configureChains(
	chainsToUse(),
	providersToUse(),
);

export const { connectors } = getDefaultWallets({
	appName: "Nation3 Court App",
	chains,
});
