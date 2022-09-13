import type { AppProps } from "next/app";
import Head from "next/head";
import { createClient, WagmiConfig, configureChains, chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Nation3Wrapper from "../components/Nation3Wrapper";

const { provider, webSocketProvider } = configureChains(
	[chain.goerli, chain.foundry],
	[publicProvider()],
);

const client = createClient({
	autoConnect: true,
	provider,
	webSocketProvider,
});

function Nation3({ Component, pageProps }: AppProps) {
	return (
		<WagmiConfig client={client}>
			<Nation3Wrapper>
				<Head>
					<title>Nation3 Court</title>
				</Head>
				<Component {...pageProps} />
			</Nation3Wrapper>
		</WagmiConfig>
	);
}

export default Nation3;
