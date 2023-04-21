import Blockies from "react-blockies";
import { AccountButton, ButtonBase, UserIcon, useScreen, ScreenType } from "@nation3/ui-components";
import { ConnectButton as RainbowConnectButton, AvatarComponent } from "@rainbow-me/rainbowkit";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useEnsAvatar } from "wagmi";
import { useState } from "react";

export const AccountAvatar: AvatarComponent = ({ address, ensImage, size }) => {
	const [avatarLoadError, setAvatarLoadError] = useState<boolean>(false);

	const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
		event.currentTarget.onerror = null;
		setAvatarLoadError(true);
	};

	return ensImage && !avatarLoadError ? (
		<img
			onError={handleAvatarError}
			src={ensImage}
			width={size}
			height={size}
			alt="ENS Avatar"
			className={`rounded-full`}
		/>
	) : (
		<div className="rounded-full overflow-hidden flex items-center bg-pr-c-green2">
			<UserIcon className={`w-[${size}px] h-[${size}px]`} />
		</div>
	);
};

export const ConnectButton = () => {
	const { screen } = useScreen();
	return (
		<RainbowConnectButton.Custom>
			{({
				account,
				chain,
				openAccountModal,
				openChainModal,
				openConnectModal,
				authenticationStatus,
				mounted,
			}) => {
				// Note: If your app doesn't use authentication, you
				// can remove all 'authenticationStatus' checks
				const ready = mounted && authenticationStatus !== "loading";
				const connected =
					ready &&
					account &&
					chain &&
					(!authenticationStatus || authenticationStatus === "authenticated");

				return (
					<div
						{...(!ready && {
							"aria-hidden": true,
							style: {
								opacity: 0,
								pointerEvents: "none",
								userSelect: "none",
							},
						})}
					>
						{(() => {
							if (!connected) {
								return (
									<ButtonBase
										className="gap-1 p-1 text-bluesky-400 bg-white border-2 border-bluesky-400 rounded-full hover:shadow transition-shadow"
										onClick={openConnectModal}
									>
										<span className="hidden font-regular tracking-wide md:inline md:w-32">
											Connect
										</span>
										<UserCircleIcon className="w-12 h-12 -m-1" />
									</ButtonBase>
								);
							}

							if (chain.unsupported) {
								return (
									<ButtonBase
										className="gap-1 p-1 text-bluesky-400 bg-white border-2 border-bluesky-400 rounded-full hover:shadow transition-shadow"
										onClick={openChainModal}
									>
										<span className="hidden font-regular tracking-wide md:inline md:w-32">
											Wrong network
										</span>
										<ExclamationTriangleIcon className="w-10 h-10" />
									</ButtonBase>
								);
							}

							return (
								<>
									<div className="flex items-center justify-end">
										<button
											className="hidden md:flex gap-2 font-medium cursor-default items-center text-neutral-400 mr-base"
											onClick={() => openChainModal()}
										>
											{/* {chain && chain.id === 5 && <span>{chain.name} </span>} */}
											<span>{chain.name} </span>
										</button>
										<AccountButton
											borderColor="pr-c-green3"
											avatar={
												<AccountAvatar
													address={account.address}
													ensImage={account.ensAvatar ?? ""}
													size={screen == ScreenType.Desktop ? 50 : 32}
												/>
											}
											account={account}
											onClick={openAccountModal}
										></AccountButton>
									</div>
								</>
							);
						})()}
					</div>
				);
			}}
		</RainbowConnectButton.Custom>
	);
};
