import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { appWithTranslation } from "next-i18next";
import React, { useEffect, useMemo, useState } from "react";

import Head from "next/head";
import type { AppProps } from "next/app";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { createClient, useAccount, WagmiConfig, useNetwork } from "wagmi";
import { DefaultLayout } from "@nation3/ui-components";
import { ConnectButton } from "../components/ConnectButton";
import { useRouter } from "next/router";
import { chains, provider, webSocketProvider, connectors } from "../lib/connectors";
import Link from "next/link";
import { useCohort } from "../hooks/useCohort";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import UiGlobals from "../components/uiGlobals/uiGlobals";

const client = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
});

const HeaderNavigation = () => {
	const router = useRouter();
	const { address } = useAccount();
	const { judges } = useCohort();

	const [isDisputesVisible, setIsDisputesVisible] = useState<boolean>(false);

	/* 	
	const isDisputesVisible = useMemo(() => {
		if (!judges || !address) return false;
		return judges.includes(address);
	}, [address, judges]); 
	*/

	// FIXME: Catched input was not updating correctly on Rainbow, recheck on each view instead of a whole re-rendering process.
	useEffect(() => {
		if (!judges || !address) return setIsDisputesVisible(false);
		setIsDisputesVisible(judges.includes(address));
	}, [address, judges]);

	const isActiveRoute = (route: string) => router.pathname.startsWith(route);

	return (
		<div className="flex items-center gap-2 font-medium text-lg text-slate-500">
			{isDisputesVisible && (
				<>
					<Link href="/disputes" className={`${isActiveRoute("/dispute") && "text-slate-700"}`}>
						<div className="hover:bg-gray-100 p-2 px-4 rounded-xl">Disputes</div>
					</Link>
					<Link href="/agreements" className={`${isActiveRoute("/agreement") && "text-slate-700"}`}>
						<div className="hover:bg-gray-100 p-2 px-4 rounded-xl">Agreements</div>
					</Link>
				</>
			)}
		</div>
	);
};

const MyApp = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();

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
				</Head>

				<UiGlobals>
					<DefaultLayout
						title="Nation3"
						appName="Agreements"
						onRoute={(route: string) => {
							router.push(route);
						}}
						isActiveRoute={(route: string) => router.pathname.startsWith(route)}
						headerNavItems={<HeaderNavigation />}
						connectionButton={<ConnectButton />}
					>
						<Component {...pageProps} />
					</DefaultLayout>
				</UiGlobals>
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default appWithTranslation(MyApp);
