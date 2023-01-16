import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { useEffect } from "react";

import Head from "next/head";
import type { AppProps } from "next/app";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { createClient, WagmiConfig } from "wagmi";
import { DefaultLayout } from "@nation3/ui-components";
import { ConnectButton } from "../components/ConnectButton";
import { useRouter } from "next/router";
import { chains, provider, webSocketProvider, connectors } from "../lib/connectors";

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
			>
				<Head>
					<title>Nation3 Court</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<DefaultLayout
					title="Nation 3"
					appName="Court"
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
