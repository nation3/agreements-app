import Blockies from "react-blockies";
import { AccountButton, Button } from "@nation3/ui-components";
import { ConnectButton as RainbowConnectButton, AvatarComponent } from "@rainbow-me/rainbowkit";

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
									<Button className="px-4" label="Connect Wallet" onClick={openConnectModal} />
								);
							}

							if (chain.unsupported) {
								return (
									<Button
										className="px-4"
										label="Wrong network"
										bgColor="red"
										onClick={openChainModal}
									/>
								);
							}

							return (
								<AccountButton
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
