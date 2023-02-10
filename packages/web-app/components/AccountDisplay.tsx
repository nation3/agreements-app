import { AddressDisplay } from "@nation3/ui-components";
import { useEnsName } from "wagmi";

export const AccountDisplay = ({ address }: { address: string }) => {
	const { data: ensName } = useEnsName({ address, chainId: 1 });
	return <AddressDisplay address={address} ensName={ensName as string} />;
};
