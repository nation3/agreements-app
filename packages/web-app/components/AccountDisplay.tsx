import { AddressDisplay } from "@nation3/ui-components";
import Image from "next/image";
import { useEnsAvatar, useEnsName } from "wagmi";

export const AccountDisplay = ({ address }: { address: string }) => {
	const { data: ensName } = useEnsName({ address, chainId: 1 });
	/* 	const {
		data: ensAvatar,
		isError,
		isLoading,
	} = useEnsAvatar({
		address: ensName,
	}); */

	return (
		<div className="bg-white">
			{/* 			<Image alt={address} src={ensAvatar ? ensAvatar : ""} className="h-min3">
				{" "}
			</Image> */}
			<AddressDisplay address={address} ensName={ensName as string} />
		</div>
	);
};
