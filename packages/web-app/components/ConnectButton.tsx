import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
	AccountButton,
	ArbitratorAccountButton,
	Button,
	EthereumIcon,
	IconRenderer,
	IllustrationRenderer,
	ScreenType,
	TextCard,
	UserIcon,
	useScreen,
} from "@nation3/ui-components";
import { AvatarComponent, ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useCohort } from "../hooks/useCohort";

export const AccountAvatar: AvatarComponent = ({ address, ensImage, size }) => {
	const [avatarLoadError, setAvatarLoadError] = useState<boolean>(false);

	const handleAvatarError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
		event.currentTarget.onerror = null;
		setAvatarLoadError(true);
	};

	return ensImage && !avatarLoadError ? (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			onError={handleAvatarError}
			src={ensImage}
			width={size}
			height={size}
			alt="ENS Avatar"
			className={`rounded-full`}
		/>
	) : (
		<IllustrationRenderer icon={<UserIcon />} size={"xs"}></IllustrationRenderer>
	);
};

export const ConnectButton = () => {
	const { screen } = useScreen();
	const { judges } = useCohort();
	const { address } = useAccount();
	const isArbitrator = useMemo(() => {
		if (!judges || !address) return false;
		return judges.includes(address);
	}, [judges, address]);
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
									<Button
										className="gap-1 p-1 text-bluesky-400 bg-white border-2 border-bluesky-400 rounded-full hover:shadow transition-shadow"
										onClick={openChainModal}
									>
										<span className="hidden font-regular tracking-wide md:inline md:w-32">
											Wrong network
										</span>
										<ExclamationTriangleIcon className="w-10 h-10" />
									</Button>
								);
							}

							return (
								<>
									<div className="flex gap-min3 items-center justify-end">
										{screen == ScreenType.Desktop && (
											<TextCard
												icon={
													/* TODO:// BUILD LOGIC FOR DYNAMIC CHAIN ICON */
													chain.name === "Ethereum" ? (
														<IconRenderer
															icon={<EthereumIcon />}
															backgroundColor={"neutral-c-200"}
															size={"xs"}
														/>
													) : (
														<></>
													)
												}
												className=""
												shadow
												onClick={() => openChainModal()}
												text={chain.name}
											/>
										)}
										{isArbitrator ? (
											<ArbitratorAccountButton
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
											/>
										) : (
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
										)}
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
