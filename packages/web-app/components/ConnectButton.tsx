import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
	AccountButton,
	Button,
	ButtonBase,
	ScreenType,
	UserIcon,
	useScreen,
	SmallCardButton,
	Body3,
	utils,
} from "@nation3/ui-components";
import { AvatarComponent, ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";

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
									<Button
										label="Connect"
										size="medium"
										className="text-sm"
										onClick={openConnectModal}
									></Button>
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
									<div className="flex items-center justify-end gap-16">
										<span className="hidden lg:flex items-center justify-center gap-8">
											<SmallCardButton className="px-2" onClick={() => openChainModal()}>
												<Body3>{chain.name}</Body3>
											</SmallCardButton>
											<SmallCardButton className="px-2" onClick={() => openAccountModal()}>
												<Body3>
													{account.ensName
														? account.ensName
														: utils.shortenHash((account.address as string) ?? "")}
												</Body3>
											</SmallCardButton>
										</span>
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
