/* eslint-disable @next/next/no-page-custom-font */
import "@nation3/ui-components/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import { appWithTranslation } from "next-i18next";
import { useEffect } from "react";
import "../styles/globals.css";

import { BottonNav, Footer, ScreenType, useScreen } from "@nation3/ui-components";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import cx from "classnames";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { WagmiConfig, createClient } from "wagmi";
import { ConnectButton } from "../components/ConnectButton";
import TopBar from "../components/TopBar";
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
					<div className="mx-auto">
						<div className="relative">
							{/* NAVBAR */}
							{screen === ScreenType.Desktop ? (
								<TopBar title="Nation3" appName="Agreements" connectionButton={<ConnectButton />} />
							) : (
								<BottonNav connectionButton={<ConnectButton />} />
							)}

							{/* CONTENT */}
							<div className={cx("min-h-screen w-full")}>{<Component {...pageProps} />}</div>

							{/* FOOTER */}
							<Footer />
						</div>
					</div>
				</UiGlobals>
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default appWithTranslation(MyApp);
