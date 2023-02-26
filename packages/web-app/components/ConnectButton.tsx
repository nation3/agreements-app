import Blockies from "react-blockies";
import { AccountButton, ButtonBase } from "@nation3/ui-components";
import { ConnectButton as RainbowConnectButton, AvatarComponent } from "@rainbow-me/rainbowkit";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export const AccountAvatar: AvatarComponent = ({ address, ensImage, size }) => {
	return ensImage ? (
		<img
			src={ensImage}
			width={size * 4}
			height={size * 4}
			alt="ENS Avatar"
			className={`rounded-full`}
		/>
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
										<div className="hidden md:flex gap-2 font-medium cursor-default items-center text-slate-300 mr-5">
											{chain && chain.id === 5 && <span>{chain.name} </span>}
											{/* // TODO: Change network action */}
											{/* 				<span className="w-4 ml-2">
												<ChevronDownIcon />
											</span> */}
										</div>
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
