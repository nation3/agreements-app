import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { useEffect } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { getDefaultWallets, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { createClient, WagmiConfig, configureChains, chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { DefaultLayout } from "@nation3/ui-components";
import { ConnectButton, AccountAvatar } from "../components/ConnectButton";
import { useRouter } from "next/router";

const { chains, provider, webSocketProvider } = configureChains(
	[chain.goerli, chain.foundry],
	[publicProvider()],
);

const { connectors } = getDefaultWallets({
	appName: "My RainbowKit App",
	chains,
});

const client = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();

	useEffect(() => {
		import("flowbite-react");
	}, []);

	return (
		<WagmiConfig client={client}>
			<RainbowKitProvider
				chains={chains}
				modalSize="compact"
				theme={lightTheme({
					accentColor: "#44b7f9",
					fontStack: "system",
				})}
				avatar={AccountAvatar}
			>
				<Head>
					<title>Nation3 Court</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<DefaultLayout
					title="Nation3 Court"
					onRoute={(route: string) => {
						router.push(route);
					}}
					isActiveRoute={(route: string) => router.pathname.startsWith(route)}
					connectionButton={<ConnectButton />}
				>
					<Component {...pageProps} />
				</DefaultLayout>
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

export default MyApp;
