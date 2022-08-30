import { ViewGridIcon } from "@heroicons/react/outline";
import { Nation3App, DefaultLayout, DefaultSidebar } from "@nation3/components";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function Nation3Wrapper({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) {
  const { address, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

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
            onRoute={console.log}
            navLinks={[
              {
                route: "/",
                icon: <ViewGridIcon className="w-5 h-5" />,
                name: "Start",
                isActive: true,
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
