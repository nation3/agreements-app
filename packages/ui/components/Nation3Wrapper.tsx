import { PencilAltIcon } from "@heroicons/react/outline";
import { Nation3App, DefaultLayout, DefaultSidebar } from "@nation3/components";
import { useRouter } from "next/router";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function Nation3Wrapper({ children }: { children: React.ReactElement | React.ReactElement[] }) {
	const { address, connector } = useAccount();
	const { connect, connectors } = useConnect();
	const { disconnect } = useDisconnect();

	const router = useRouter();

	return (
		<Nation3App>
			<DefaultLayout
				sidebar={
					<DefaultSidebar
						onConnect={(connector) => {
							connect({
								connector: connectors.find((i) => i.name === connector.name),
							});
						}}
						logo={<img src="/logo.svg" alt="Nation3 Logo" />}
						onRoute={() => router.push("/agreements")}
						navLinks={[
							{
								route: "/agreements",
								icon: <PencilAltIcon className="w-5 h-5" />,
								name: "Agreements",
								isActive: router.pathname.startsWith("/agreements"),
							},
						]}
						connectors={connectors.map((connector) => ({
							...connector,
						}))}
						account={
							address && connector
								? {
										address,
										connector,
								  }
								: undefined
						}
						onDisconnect={disconnect}
					/>
				}
			>
				{children}
			</DefaultLayout>
		</Nation3App>
	);
}

export default Nation3Wrapper;
