import Blockies from "react-blockies";
import { AccountButton, ButtonBase } from "@nation3/ui-components";
import { ConnectButton as RainbowConnectButton, AvatarComponent } from "@rainbow-me/rainbowkit";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export const AccountAvatar: AvatarComponent = ({ address, ensImage, size }) => {
	return ensImage ? (
		<Image src={ensImage} width={48} height={48} alt="ENS Avatar" className={`rounded-full`} />
	) : (
		<Blockies seed={address} size={size} className="overflow-hidden rounded-full" />
	);
};

export const ConnectButton = () => {
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
										className="gap-1 p-4 text-white bg-bluesky-400"
										onClick={openConnectModal}
									>
										<UserIcon className="w-8 h-8" />
										<span className="hidden md:inline">Connect</span>
									</ButtonBase>
								);
							}

							if (chain.unsupported) {
								return (
									<ButtonBase className="gap-1 p-4 text-white bg-red-400" onClick={openChainModal}>
										<ExclamationTriangleIcon className="w-8 h-8" />
										<span className="hidden md:inline">Wrong network</span>
									</ButtonBase>
								);
							}

							return (
								<AccountButton
									className="gap-1 p-2 bg-white hover:bg-gray-100"
									avatar={
										<AccountAvatar
											address={account.address}
											ensImage={account.ensAvatar ?? ""}
											size={12}
										/>
									}
									account={account}
									onClick={openAccountModal}
								></AccountButton>
							);
						})()}
					</div>
				);
			}}
		</RainbowConnectButton.Custom>
	);
};
