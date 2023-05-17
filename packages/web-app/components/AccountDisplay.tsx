import { WalletIcon } from "@heroicons/react/24/solid";
import { AddressDisplay, IconLoader } from "@nation3/ui-components";
import Image from "next/image";
import React, { useState } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";

export const AccountDisplay = ({ address }: { address: string }) => {
	const { data: ensName } = useEnsName({ address, chainId: 1 });
	const [avatarSrc, setAvatarSrc] = useState<any>("");
	const [avatarLoadError, setAvatarLoadError] = useState<boolean>(false);

	const {
		data: ensAvatar,
		isError,
		isLoading,
	} = useEnsAvatar({
		onSuccess(data) {
			setAvatarSrc(data);
			console.log(address, ensAvatar);
		},
		onError(error) {
			setAvatarLoadError(true);
		},
		addressOrName: address,
	});

	const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
		event.currentTarget.onerror = null;
		setAvatarLoadError(true);
	};

	return (
		<div className="bg-white flex items-center rounded-sm">
			{ensAvatar && !avatarLoadError ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					onError={handleAvatarError}
					alt={address}
					src={ensAvatar}
					width={24}
					height={24}
					className="h-base w-base rounded-sm bg-pr-c-blue1"
				/>
			) : (
				<div className="h-base w-base rounded-sm bg-pr-c-blue1 flex justify-center items-center">
					{/* {isLoading && <IconLoader src={} />} */}
					<WalletIcon className="h-min3 text-pr-c-blue3" />
				</div>
			)}
			<AddressDisplay className="px-min2" address={address} ensName={ensName as string} />
		</div>
	);
};
