import {
	CheckCircleIcon,
	ExclamationTriangleIcon,
	InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Body2, Body3, Button, ButtonBase, ModalNew, Spinner } from "@nation3/ui-components";
import cx from "classnames";
import { BigNumber, BigNumberish, constants, utils } from "ethers";
import { Tooltip } from "flowbite-react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useAgreementJoin } from "../hooks/useAgreement";
import { useConstants } from "../hooks/useConstants";
import { usePermit2Allowance, usePermit2BatchTransferSignature } from "../hooks/usePermit2";
import { useTokenAllowance, useTokenApprovals, useTokenBalance } from "../hooks/useToken";
import courtIcon from "../public/svgs/court.svg";
import { useAgreementData } from "./agreement/context/AgreementDataContext";
import { check } from "prettier";

const InfoTooltip = ({ info, className }: { info: string; className?: string }) => {
	return (
		<Tooltip style="light" animation="duration-150" content={info}>
			<InformationCircleIcon className={className} />
		</Tooltip>
	);
};

const WarningTooltip = ({ info, className }: { info: string; className?: string }) => {
	return (
		<Tooltip style="light" animation="duration-150" content={info}>
			<ExclamationTriangleIcon className={className} />
		</Tooltip>
	);
};

interface ToogleProps {
	checked?: boolean;
	onToggle?: (checked: boolean) => void;
}

const Toggle = ({ onToggle, checked = false }: ToogleProps) => {
	const [isChecked, setIsChecked] = useState<boolean>(checked);

	const toggle = () => {
		setIsChecked(!isChecked);
		if (onToggle) {
			onToggle(!isChecked);
		}
	};

	return (
		<label className="relative inline-flex items-center cursor-pointer">
			<input type="checkbox" className="sr-only" checked={isChecked} onChange={toggle} />
			<div
				className={cx(
					"w-10 h-6 bg-transparent rounded-full border-2",
					isChecked ? "border-pr-c-green3" : "border-neutral-c-300",
				)}
			>
				<div
					className={cx(
						"transform transition-transform ease-in-out duration-200",
						isChecked ? "translate-x-5 bg-pr-c-green3" : "translate-x-1 bg-neutral-c-300",
						"absolute inset-y-0 left-0 flex items-center justify-center translate-y-1 w-4 h-4 rounded-full",
					)}
				></div>
			</div>
		</label>
	);
};

const CompactOutlineButton = ({
	label,
	onClick,
	isLoading,
	disabled = false,
}: {
	label: string;
	onClick?: () => any;
	isLoading?: boolean;
	disabled?: boolean;
}) => {
	return (
		<ButtonBase
			className={cx(
				"px-3 py-1 gap-1 border-2 font-semibold transition-all rounded-full",
				!disabled && "border-bluesky text-bluesky",
			)}
			disabled={disabled}
			onClick={onClick}
		>
			{label}
		</ButtonBase>
	);
};

const OutlineButton = ({
	label,
	disabled = false,
	onClick,
}: {
	label: string;
	disabled?: boolean;
	onClick?: () => void;
}) => {
	return (
		<div
			onClick={onClick}
			className={cx(
				"py-3 group transition-all px-5 border-bluesky border-2 rounded-lg flex min-w-[200px] items-center text-bluesky gap-2",
				disabled ? "opacity-50" : "cursor-pointer  hover:bg-bluesky hover:text-white",
			)}
		>
			<p>{label}</p>
		</div>
	);
};

const AssetApprove = ({
	title,
	amount,
	symbol,
	action,
	info,
	warning,
	showWarning,
}: {
	title: string;
	amount: BigNumberish;
	symbol: string;
	action?: ReactNode;
	info: string;
	warning: string;
	showWarning: boolean;
}) => {
	return (
		<div className="flex w-full justify-between items-end gap-2 pt-3 pb-2 border-b border-bluesky-100">
			<div className="flex flex-col gap-2">
				<p className="font-semibold text-2xl text-bluesky flex items-center">
					${symbol}
					<span>
						<WarningTooltip
							info={warning}
							className={cx("w-4 h-4 ml-2 text-yellow-500", showWarning ? "block" : "hidden")}
						/>
					</span>
				</p>
			</div>
			<div className="flex w-fit">{action}</div>
		</div>
	);
};

const AssetDisplay = ({
	title,
	amount,
	symbol,
	info,
	warning,
	showWarning,
}: {
	title: string;
	amount: BigNumberish;
	symbol: string;
	info: string;
	warning: string;
	showWarning: boolean;
}) => {
	return (
		<div className="flex w-full justify-between items-end gap-2 pt-3 pb-2 border-b border-bluesky-100">
			<div className="flex flex-col gap-2">
				<span className="flex items-center gap-1">
					<span className="text-lg">{title}</span>
					<InfoTooltip info={info} className="w-4 h-4" />
					<WarningTooltip
						info={warning}
						className={cx("w-4 h-4 text-yellow-500", showWarning ? "block" : "hidden")}
					/>
				</span>
				<span className="font-semibold text-2xl text-bluesky">
					{utils.formatUnits(amount)} ${symbol}
				</span>
			</div>
		</div>
	);
};

export const JoinModal = ({ onClose, isOpen }: { onClose: () => void; isOpen: boolean }) => {
	const { frameworkAddress, NATION } = useConstants();
	const { t } = useTranslation("common");
	const { address } = useAccount();
	const {
		id,
		userPosition,
		disputeCost: requiredDeposit,
		collateralToken,
		depositToken,
	} = useAgreementData();
	const [usePermit2, setUsePermit2] = useState<boolean>(false);
	const [signLoading, setSignLoading] = useState<boolean>(false);

	const userResolver = useMemo(
		() => ({
			account: address || constants.AddressZero,
			balance: userPosition?.resolver?.balance || "0",
			proof: userPosition?.resolver?.proof || [],
		}),
		[address, userPosition],
	);

	const requiredCollateral = useMemo((): BigNumber => {
		return BigNumber.from(userPosition?.resolver?.balance || 0);
	}, [userPosition]);

	const depositPermit2AllowanceConfig = useMemo(
		() => ({
			token: depositToken?.address ?? constants.AddressZero,
			account: address ?? constants.AddressZero,
			enabled: !!address && !!depositToken?.address,
		}),
		[address, depositToken],
	);

	const collateralPermit2AllowanceConfig = useMemo(
		() => ({
			token: collateralToken?.address ?? constants.AddressZero,
			account: address ?? constants.AddressZero,
			enabled: !!address && !!collateralToken?.address,
		}),
		[address, collateralToken],
	);

	const {
		isEnough: depositTokenPermit2,
		approve: approveDepositTokenPermit2,
		approvalLoading: depositTokenPermit2ApprovalLoading,
	} = usePermit2Allowance(depositPermit2AllowanceConfig);

	const {
		isEnough: collateralTokenPermit2,
		approve: approveCollateralTokenPermit2,
		approvalLoading: collateralTokenPermit2ApprovalLoading,
	} = usePermit2Allowance(collateralPermit2AllowanceConfig);

	const depositAllowanceConfig = useMemo(
		() => ({
			address: depositToken?.address || constants.AddressZero,
			owner: address || constants.AddressZero,
			spender: frameworkAddress,
			enabled: !!address && !!depositToken?.address,
		}),
		[address, depositToken, frameworkAddress],
	);

	const collateralAllowanceConfig = useMemo(
		() => ({
			address: collateralToken?.address || constants.AddressZero,
			owner: address || constants.AddressZero,
			spender: frameworkAddress,
			enabled: !!address && !!collateralToken?.address,
		}),
		[address, collateralToken, frameworkAddress],
	);

	const { allowance: depositTokenAllowanceData } = useTokenAllowance(depositAllowanceConfig);

	const { allowance: collateralTokenAllowanceData } = useTokenAllowance(collateralAllowanceConfig);

	const depositBalanceConfig = useMemo(
		() => ({
			address: depositToken?.address || constants.AddressZero,
			account: address || constants.AddressZero,
			enabled: !!address && !!depositToken?.address,
		}),
		[address, depositToken],
	);

	const collateralBalanceConfig = useMemo(
		() => ({
			address: collateralToken?.address || constants.AddressZero,
			account: address || constants.AddressZero,
			enabled: !!address && !!collateralToken?.address,
		}),
		[address, collateralToken],
	);

	const { balance: depositBalanceData } = useTokenBalance(depositBalanceConfig);

	const { balance: collateralBalanceData } = useTokenBalance(collateralBalanceConfig);

	const isSameToken = useMemo((): boolean => {
		return depositToken?.address === collateralToken?.address;
	}, [depositToken, collateralToken]);

	const depositUserBalance = useMemo(() => {
		return BigNumber.isBigNumber(depositBalanceData) ? depositBalanceData : BigNumber.from(0);
	}, [depositBalanceData]);

	const collateralUserBalance = useMemo(() => {
		return BigNumber.isBigNumber(collateralBalanceData) ? collateralBalanceData : BigNumber.from(0);
	}, [collateralBalanceData]);

	const depositTokenAllowance = useMemo(() => {
		return BigNumber.isBigNumber(depositTokenAllowanceData)
			? depositTokenAllowanceData
			: BigNumber.from(0);
	}, [depositTokenAllowanceData]);

	const collateralTokenAllowance = useMemo(() => {
		return BigNumber.isBigNumber(collateralTokenAllowanceData)
			? collateralTokenAllowanceData
			: BigNumber.from(0);
	}, [collateralTokenAllowanceData]);

	const enoughDeposit = useMemo((): boolean => {
		return depositUserBalance.gte(requiredDeposit);
	}, [depositUserBalance, requiredDeposit]);

	const enoughCollateral = useMemo((): boolean => {
		return collateralUserBalance.gte(requiredCollateral);
	}, [collateralUserBalance, requiredCollateral]);

	const enoughDepositAllowance = useMemo((): boolean => {
		return depositTokenAllowance.gte(requiredDeposit);
	}, [depositTokenAllowance, requiredDeposit]);

	const enoughCollateralAllowance = useMemo((): boolean => {
		return collateralTokenAllowance.gte(requiredCollateral);
	}, [collateralTokenAllowance, requiredCollateral]);

	const depositApprovalConfig = useMemo(
		() => ({
			address: depositToken?.address || constants.AddressZero,
			spender: frameworkAddress,
		}),
		[depositToken, frameworkAddress],
	);

	const collateralApprovalConfig = useMemo(
		() => ({
			address: collateralToken?.address || constants.AddressZero,
			spender: frameworkAddress,
		}),
		[collateralToken, frameworkAddress],
	);

	const { approve: approveDepositToken, approvalLoading: depositTokenApprovalLoading } =
		useTokenApprovals(depositApprovalConfig);

	const { approve: approveCollateralToken, approvalLoading: collateralTokenApprovalLoading } =
		useTokenApprovals(collateralApprovalConfig);

	const approveDeposit = useCallback(() => {
		const amount = isSameToken ? requiredDeposit.add(requiredCollateral) : requiredDeposit;
		approveDepositToken({ amount });
	}, [approveDepositToken, requiredDeposit, requiredCollateral, isSameToken]);

	const approveCollateral = useCallback(() => {
		const amount = isSameToken ? requiredDeposit.add(requiredCollateral) : requiredCollateral;
		approveCollateralToken({ amount });
	}, [approveCollateralToken, requiredDeposit, requiredCollateral, isSameToken]);

	/*
	const missingNATION = useMemo((): boolean => {
		if (isSameToken) {
			return depositUserBalance.lt(requiredDeposit.add(requiredCollateral));
		}
		return !enoughDeposit;
	}, [isSameToken, requiredDeposit, requiredCollateral, depositUserBalance, enoughDeposit]);
	*/

	const enoughBalance = useMemo((): boolean => {
		if (isSameToken) {
			return depositUserBalance.gte(requiredDeposit.add(requiredCollateral));
		}
		return depositUserBalance.gte(requiredDeposit) && collateralUserBalance.gte(requiredCollateral);
	}, [isSameToken, depositUserBalance, collateralUserBalance, requiredDeposit, requiredCollateral]);

	const tokenTransfers = useMemo(() => {
		return [
			{
				token: depositToken?.address ?? constants.AddressZero,
				amount: requiredDeposit ? requiredDeposit : 0,
			},
			{ token: collateralToken?.address ?? constants.AddressZero, amount: requiredCollateral },
		];
	}, [depositToken, collateralToken, requiredDeposit, requiredCollateral]);

	const usePermit2BatchTransferSignatureConfig = useMemo(
		() => ({
			tokenTransfers,
			spender: frameworkAddress,
			address: address ?? constants.AddressZero,
		}),
		[tokenTransfers, frameworkAddress, address],
	);

	const { permit, signature, signPermit, signError, signSuccess, signReady } =
		usePermit2BatchTransferSignature(usePermit2BatchTransferSignatureConfig);

	useEffect(() => {
		if (signError || signSuccess) {
			setSignLoading(false);
		}
	}, [signError, signSuccess]);

	const depositAction = useMemo(() => {
		if (!enoughDeposit) {
			return (
				<Link target="_blank" href="https://app.balancer.fi/#/ethereum/swap">
					<Button label={`${"Get $" + depositToken?.symbol}`} />
				</Link>
			);
		} else if (usePermit2) {
			if (typeof depositTokenPermit2 === "undefined" || depositTokenPermit2ApprovalLoading)
				return <Spinner className="w-7 h-7 text-bluesky" />;
			if (depositTokenPermit2) return <CheckCircleIcon className="w-7 h-7 text-bluesky" />;
			return <Button label={"Enable"} onClick={approveDepositTokenPermit2} />;
		} else {
			if (typeof depositTokenAllowance === "undefined" || depositTokenApprovalLoading)
				return <Spinner className="w-7 h-7 text-bluesky" />;
			if (enoughDepositAllowance) return <CheckCircleIcon className="w-7 h-7 text-bluesky" />;
			return <Button label={"Approve"} onClick={approveDeposit} />;
		}
	}, [
		usePermit2,
		enoughDeposit,
		depositTokenPermit2,
		depositTokenPermit2ApprovalLoading,
		enoughDepositAllowance,
		depositTokenAllowance,
		depositTokenApprovalLoading,
		enoughDepositAllowance,
	]);

	const collateralAction = useMemo(() => {
		if (!enoughCollateral) {
			return (
				<Link target="_blank" href="https://app.balancer.fi/#/ethereum/swap">
					<CompactOutlineButton label={`${"Get $" + collateralToken?.symbol}`} />
				</Link>
			);
		} else if (usePermit2) {
			if (typeof collateralTokenPermit2 === "undefined" || collateralTokenPermit2ApprovalLoading)
				return <Spinner className="w-7 h-7 text-bluesky" />;
			if (collateralTokenPermit2 || requiredCollateral.eq(0)) {
				return <CheckCircleIcon className="w-7 h-7 text-bluesky" />;
			}
			return <CompactOutlineButton label={"Enable"} onClick={approveCollateralTokenPermit2} />;
		} else {
			if (isSameToken) return <CompactOutlineButton label={"Approve"} disabled />;
			if (typeof collateralTokenAllowance === "undefined" || collateralTokenApprovalLoading)
				return <Spinner className="w-7 h-7 text-bluesky" />;
			if (enoughCollateralAllowance) return <CheckCircleIcon className="w-7 h-7 text-bluesky" />;
			return <CompactOutlineButton label={"Approve"} onClick={approveCollateral} />;
		}
	}, [
		usePermit2,
		isSameToken,
		collateralTokenPermit2,
		collateralTokenPermit2ApprovalLoading,
		collateralTokenAllowance,
		collateralTokenApprovalLoading,
		enoughCollateralAllowance,
		requiredCollateral,
	]);

	const signAction = useMemo(() => {
		if (signSuccess && signature) return <CheckCircleIcon className="w-7 h-7 text-bluesky" />;
		if (signLoading || !signReady) return <Spinner className="w-6 h-6 text-bluesky" />;
		return (
			<CompactOutlineButton
				label={t("join.signPermit.action")}
				onClick={() => {
					signPermit();
					setSignLoading(true);
				}}
			/>
		);
	}, [signSuccess, signature, signLoading, signPermit, signReady]);

	const canJoin = useMemo(() => {
		if (!enoughBalance) return false;
		if (usePermit2) {
			if (!depositTokenPermit2 || (!collateralTokenPermit2 && requiredCollateral.gt(0))) {
				return false;
			}
			return signature !== undefined ? true : false;
		} else if (!enoughDepositAllowance || !enoughCollateralAllowance) {
			return false;
		}
		return true;
	}, [
		enoughBalance,
		usePermit2,
		signature,
		enoughDepositAllowance,
		enoughCollateralAllowance,
		depositTokenPermit2,
		collateralTokenPermit2,
		requiredCollateral,
	]);

	const joinMode = useMemo(() => {
		return usePermit2 ? "permit" : "approval";
	}, [usePermit2]);

	const { join, isProcessing: joinLoading, isTxSuccess } = useAgreementJoin({ mode: joinMode });

	useEffect(() => {
		// TODO: Refactor into promises chains on click instead of listening events
		isTxSuccess && window && window.location.reload();
	}, [isTxSuccess]);

	return (
		<ModalNew isOpen={isOpen} onClose={onClose}>
			<section className="bg-white rounded-lg shadow w-full max-w-2xl border-neutral-c-300 border-2 overflow-hidden">
				<header className="bg-white border-b-2 border-neutral-c-300 p-base">
					<div className="flex items-center w-full pl-3">
						{courtIcon && (
							<div className="overflow-hidden flex items-center justify-center h-1/2 mr-6">
								<Image
									className="h-full"
									width={40}
									height={40}
									src={courtIcon}
									alt={"Join Agreement"}
								/>
							</div>
						)}
						<h3 className="text-neutral-c-600 md:text-xl text-xl font-semibold">
							{t("join.title")}
						</h3>
					</div>
				</header>
				<div className="flex flex-col items-center justify-center p-base++">
					<div className="flex flex-col w-full items-start gap-1 text-neutral-c-400 text-sm">
						<div className="flex w-full md:w-2/3">
							<Body3 className="text-sm text-neutral-c-400  mb-1">{t("join.summary")}</Body3>
						</div>

						{/* TOKEN REQUIRMENTS */}
						<Body3 className=" mt-4 text-neutral-c-600 font-semibold">
							{t("join.requirementsHeadline")}
						</Body3>
						<div className="flex w-full gap-3">
							<AssetDisplay
								title={"Dispute deposit"}
								amount={requiredDeposit}
								symbol={depositToken?.symbol ?? ""}
								info={t("agreement.depositInfo")}
								warning={"Not enough balance"}
								showWarning={!enoughDeposit}
							/>
							<AssetDisplay
								title={"Collateral"}
								amount={requiredCollateral}
								symbol={collateralToken?.symbol ?? ""}
								info={t("agreement.collateralInfo")}
								warning={"Not enough balance"}
								showWarning={!enoughCollateral}
							/>
						</div>
						<div className="mt-4 flex w-full items-center justify-between gap-2 py-2">
							<Body3>{t("join.approvalsHeadline")}</Body3>
							{enoughDeposit && enoughCollateral && (
								<>
									<div className="flex w-full items-center justify-end gap-1">
										<Body2 className="text-md">{t("join.gaslessApprovals.title")}</Body2>
										<InfoTooltip info={t("join.gaslessApprovals.info")} className="w-5 h-5" />
									</div>
									<Toggle checked={usePermit2} onToggle={(checked) => setUsePermit2(checked)} />
								</>
							)}
						</div>
						<AssetApprove
							title={"Dispute deposit"}
							amount={requiredDeposit}
							symbol={depositToken?.symbol ?? ""}
							info={t("agreement.depositInfo")}
							warning={"Not enough balance"}
							showWarning={!enoughDeposit}
							action={depositAction}
						></AssetApprove>
						{depositToken?.symbol !== collateralToken?.symbol && (
							<AssetApprove
								title={"Collateral"}
								amount={requiredCollateral}
								symbol={collateralToken?.symbol ?? ""}
								info={t("agreement.collateralInfo")}
								warning={"Not enough balance"}
								showWarning={!enoughCollateral}
								action={collateralAction}
							></AssetApprove>
						)}
						{!enoughDeposit ||
							(!enoughCollateral && (
								<div className="flex mt-4">
									<WarningTooltip info={""} className={cx("w-4 h-4 mr-2 text-yellow-500")} />
									<p>{t("agreement.lackingTokens")}</p>
								</div>
							))}
						<div className="flex w-full">
							{usePermit2 && enoughDeposit && enoughCollateral && (
								<div className="flex w-full justify-between items-start gap-2 pt-3 pb-2 mb-6">
									<span className="flex items-center gap-1">
										<span className="text-lg">{t("join.signPermit.title")}</span>
										<InfoTooltip info={t("join.signPermit.info")} className="w-4 h-4" />
									</span>
									<div className="flex w-fit">{signAction}</div>
								</div>
							)}
						</div>

						{/* CTA */}
						<div className="flex w-full justify-end mt-base">
							<div className="">
								<Button
									className="rounded-full px-6"
									outlined
									label="Join Agreement"
									disabled={!canJoin}
									isLoading={joinLoading}
									onClick={() => {
										if (usePermit2) {
											join({ id, resolver: userResolver, permit, signature });
										} else {
											join({ id, resolver: userResolver });
										}
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
		</ModalNew>
	);
};
