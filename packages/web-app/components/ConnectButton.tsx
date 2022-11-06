import Blockies from "react-blockies";
import { AccountButton, Button, ButtonBase } from "@nation3/ui-components";
import { ConnectButton as RainbowConnectButton, AvatarComponent } from "@rainbow-me/rainbowkit";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";

export const AccountAvatar: AvatarComponent = ({ address, ensImage, size }) => {
	return ensImage ? (
		<picture>
			<img src={ensImage} alt="ENS Avatar" className={`w-${size} h-${size} rounded-full`} />
		</picture>
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
										className="p-3 gap-1 text-white bg-bluesky-400"
										onClick={openConnectModal}
									>
										<UserIcon className="w-10 h-10" />
										<span className="hidden md:inline">Connect</span>
									</ButtonBase>
								);
							}

							if (chain.unsupported) {
								return (
									<ButtonBase className="p-3 gap-1 text-white bg-red-400" onClick={openChainModal}>
										<ExclamationTriangleIcon className="w-10 h-10" />
										<span className="hidden md:inline">Wrong network</span>
									</ButtonBase>
								);
							}

							return (
								<AccountButton
									className="p-2 gap-1 bg-white"
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
