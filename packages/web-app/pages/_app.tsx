/* eslint-disable @next/next/no-page-custom-font */
import "@nation3/ui-components/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import { appWithTranslation } from "next-i18next";
import { useEffect } from "react";
import "../styles/globals.css";

import { useScreen } from "@nation3/ui-components";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { WagmiConfig, createClient } from "wagmi";
import LayoutLoader from "../components/LayoutLoader";
import UiGlobals from "../components/uiGlobals/uiGlobals";
import { chains, connectors, provider, webSocketProvider } from "../lib/connectors";

const client = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();

	useEffect(() => {
		import("flowbite-react");
	}, []);
	const { screen } = useScreen();

	return (
		<WagmiConfig client={client}>
			<RainbowKitProvider
				chains={chains}
				initialChain={1}
				modalSize="compact"
				theme={lightTheme({
					accentColor: "#44b7f9",
					fontStack: "system",
				})}
			>
				<Head>
					<title>Nation3 Agreements</title>
					<link rel="icon" href="/favicon.ico" />
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
						rel="stylesheet"
					/>
				</Head>

				<UiGlobals>
					<LayoutLoader>
						<Component {...pageProps} />
					</LayoutLoader>
				</UiGlobals>
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default appWithTranslation(MyApp);
