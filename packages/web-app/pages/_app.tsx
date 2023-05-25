import "@nation3/ui-components/styles.css";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { appWithTranslation } from "next-i18next";
import React, { ReactElement, ReactNode, memo, useEffect, useState } from "react";

import type { NextPage } from "next";
import Head from "next/head";
import type { AppProps } from "next/app";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { createClient, useAccount, WagmiConfig, useNetwork } from "wagmi";
import { useRouter } from "next/router";
import { chains, provider, webSocketProvider, connectors } from "../lib/connectors";
import Link from "next/link";
import { useCohort } from "../hooks/useCohort";
import Layout from "../components/layout/Layout";

const client = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
});

const defaultLayout = (page: ReactElement) => {
	return <Layout>{page}</Layout>;
};

// eslint-disable-next-line react/display-name
const HeaderNavigation = memo(() => {
	const { address } = useAccount();
	const { judges } = useCohort();

	const [isDisputesVisible, setIsDisputesVisible] = useState<boolean>(false);

	useEffect(() => {
		if (!judges || !address) return setIsDisputesVisible(false);
		setIsDisputesVisible(judges.includes(address));
	}, [address, judges, setIsDisputesVisible]);

	return (
		<>
			<Link
				href="/agreements"
				className={`${"text-sm py-min2 px-min3 bg-white shadow rounded-md ml-min3 text-neutral-700"}`}
			>
				Agreements
			</Link>
			{isDisputesVisible && (
				<>
					<Link
						href="/disputes"
						className={`${"text-sm py-min2 px-min3 bg-white shadow rounded-md ml-min3 text-neutral-700"}`}
					>
						Disputes
					</Link>
				</>
			)}
		</>
	);
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
	const router = useRouter();
	// As recommended in https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#per-page-layouts
	const getLayout = Component.getLayout ?? defaultLayout;

	useEffect(() => {
		import("flowbite-react");
	}, []);

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
				<div id="ui-root">{getLayout(<Component {...pageProps} />)}</div>
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default appWithTranslation(MyApp);
