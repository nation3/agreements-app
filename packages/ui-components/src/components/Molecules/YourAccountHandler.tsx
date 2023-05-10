import { WalletIcon } from "@heroicons/react/24/solid";
import { AddressDisplay, IconLoader } from "@nation3/ui-components";
import Image from "next/image";
import React from "react";
import { useEnsAvatar, useEnsName } from "wagmi";

export const AccountDisplay = ({ address }: { address: string }) => {
	const { data: ensName } = useEnsName({ address, chainId: 1 });
	const {
		data: ensAvatar,
		isError,
		isLoading,
	} = useEnsAvatar({
		/*
		onSuccess(data) {
			console.log("Success AVATAR", data);
		},
		*/
		addressOrName: address,
	});

	return (
		<div className="bg-white flex items-center rounded-sm">
			{ensAvatar ? (
				<Image
					alt={address}
					src={ensAvatar ? ensAvatar : ""}
					width={24}
					height={24}
					className="h-base w-base rounded-sm bg-pr-c-blue1"
				/>
			) : (
				<div className="h-base w-base rounded-sm bg-pr-c-blue1 flex justify-center items-center">
					{/* <IconLoader src={} /> */}
					<WalletIcon className="h-min3 text-pr-c-blue3" />
				</div>
			)}
			<AddressDisplay className="px-min2" address={address} ensName={ensName as string} />
		</div>
	);
};
