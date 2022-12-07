import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { configureChains, chain } from "wagmi";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

export const providers = () => {
	const providers = [];
	if (process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
		providers.push(
			alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, priority: 0 }),
		);
	}
	providers.push(publicProvider({ priority: 1 }));
	return providers;
};

export const chainsToUse = () => {
	return [chain.goerli, chain.mainnet];
};

export const { chains, provider, webSocketProvider } = configureChains(chainsToUse(), providers());

export const { connectors } = getDefaultWallets({
	appName: "Nation3 Court App",
	chains,
});
