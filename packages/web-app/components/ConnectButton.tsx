import Blockies from "react-blockies";
import { AccountButton, ButtonBase } from "@nation3/ui-components";
import { ConnectButton as RainbowConnectButton, AvatarComponent } from "@rainbow-me/rainbowkit";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export const AccountAvatar: AvatarComponent = ({ address, ensImage, size }) => {
	return ensImage ? (
		<Image src={ensImage} width={30} height={30} alt="ENS Avatar" className={`rounded-full`} />
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
										className="gap-1 p-2 px-5 text-bluesky-400 bg-white border-2 border-bluesky-400 rounded-full hover:shadow transition-shadow"
										onClick={openConnectModal}
									>
										<span className="hidden pl-2 font-regular tracking-wide md:inline md:mr-2">
											Connect
										</span>
										<UserCircleIcon className="w-8 h-8" />
									</ButtonBase>
								);
							}

							if (chain.unsupported) {
								return (
									<ButtonBase
										className="gap-1 p-3 px-6 text-bluesky-400 bg-white border-2 border-bluesky-400 rounded-full hover:shadow transition-shadow"
										onClick={openChainModal}
									>
										<ExclamationTriangleIcon className="w-8 h-8" />
										<span className="hidden md:inline"> ⚠️ Wrong network</span>
									</ButtonBase>
								);
							}

							return (
								<AccountButton
									className="font-semibold text-slate-600 tracking-wide shadow rounded-full md:pl-5 md:pr-2 md:py-2 p-2 bg-white hover:bg-gray-100"
									avatar={
										<AccountAvatar
											address={account.address}
											ensImage={account.ensAvatar ?? ""}
											size={10}
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
