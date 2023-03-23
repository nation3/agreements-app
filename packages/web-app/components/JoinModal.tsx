import { useMemo, useState, useCallback, ReactNode } from "react";
import { Tooltip, Modal as FlowModal } from "flowbite-react";
import Image from "next/image";
import cx from "classnames";
import { BigNumber, BigNumberish, constants, utils } from "ethers";
import { usePermit2Allowance, usePermit2BatchTransferSignature } from "../hooks/usePermit2";
import { useTokenBalance } from "../hooks/useToken";
import { useAgreementJoin } from "../hooks/useAgreement";
import courtIcon from "../public/svgs/court.svg";
import {
	ExclamationTriangleIcon,
	InformationCircleIcon,
	CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";
import { ButtonBase, Spinner } from "@nation3/ui-components";
import { useAgreementData } from "./agreement/context/AgreementDataContext";
import { useAccount } from "wagmi";
import { useConstants } from "../hooks/useConstants";
import { useTokenAllowance, useTokenApprovals } from "../hooks/useToken";

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

const Toggle = ({ onToggle }: { onToggle?: (checked: boolean) => void }) => {
	const [isChecked, setIsChecked] = useState<boolean>(false);

	const toggle = () => {
		setIsChecked(!isChecked);
		if (onToggle) {
			onToggle(!isChecked);
		}
	};

	return (
		<label className="relative inline-flex items-center cursor-pointer">
			<input type="checkbox" className="sr-only peer" checked={isChecked} onChange={toggle} />
			<div className="w-11 h-6 bg-transparent border-2 border-gray-300 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-bluesky rounded-full peer peer-checked:border-greensea peer-checked:after:bg-greensea peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[6px] after:bg-gray-200 after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
		</label>
	);
};

const CompactOutlineButton = ({
	label,
	onClick,
	disabled = false,
}: {
	label: string;
	onClick?: () => any;
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
	loading = false,
}: {
	label: string;
	disabled?: boolean;
	onClick?: () => void;
	loading?: boolean;
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

const AssetDisplay = ({
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
			<div className="flex w-fit">{action}</div>
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

	const {
		isEnough: depositTokenPermit2,
		approve: approveDepositTokenPermit2,
		approvalLoading: depositTokenPermit2ApprovalLoading,
	} = usePermit2Allowance({
		token: depositToken?.address ?? constants.AddressZero,
		account: address ?? constants.AddressZero,
		enabled: !!address && !!depositToken?.address,
	});

	const {
		isEnough: collateralTokenPermit2,
		approve: approveCollateralTokenPermit2,
		approvalLoading: collateralTokenPermit2ApprovalLoading,
	} = usePermit2Allowance({
		token: collateralToken?.address ?? constants.AddressZero,
		account: address ?? constants.AddressZero,
		enabled: !!address && !!collateralToken?.address,
	});

	const { allowance: depositTokenAllowanceData } = useTokenAllowance({
		address: depositToken?.address || constants.AddressZero,
		owner: address || constants.AddressZero,
		spender: frameworkAddress,
		enabled: !!address && !!depositToken?.address,
	});

	const { allowance: collateralTokenAllowanceData } = useTokenAllowance({
		address: collateralToken?.address || constants.AddressZero,
		owner: address || constants.AddressZero,
		spender: frameworkAddress,
		enabled: !!address && !!collateralToken?.address,
	});

	const { balance: depositBalanceData } = useTokenBalance({
		address: depositToken?.address || constants.AddressZero,
		account: address || constants.AddressZero,
		enabled: !!address && !!depositToken?.address,
	});

	const { balance: collateralBalanceData } = useTokenBalance({
		address: collateralToken?.address || constants.AddressZero,
		account: address || constants.AddressZero,
		enabled: !!address && !!collateralToken?.address,
	});

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

	const { approve: approveDepositToken, approvalLoading: depositTokenApprovalLoading } =
		useTokenApprovals({
			address: depositToken?.address || constants.AddressZero,
			spender: frameworkAddress,
		});

	const { approve: approveCollateralToken, approvalLoading: collateralTokenApprovalLoading } =
		useTokenApprovals({
			address: collateralToken?.address || constants.AddressZero,
			spender: frameworkAddress,
		});

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

	const { permit, signature, signPermit, signSuccess, signError } =
		usePermit2BatchTransferSignature({
			tokenTransfers: [
				{
					token: depositToken?.address ?? constants.AddressZero,
					amount: requiredDeposit ? requiredDeposit : 0,
				},
				{ token: collateralToken?.address ?? constants.AddressZero, amount: requiredCollateral },
			],
			spender: frameworkAddress,
			address: address ?? constants.AddressZero,
		});

	const depositAction = useMemo(() => {
		if (usePermit2) {
			if (typeof depositTokenPermit2 === "undefined" || depositTokenPermit2ApprovalLoading)
				return <Spinner className="w-7 h-7 text-bluesky" />;
			if (depositTokenPermit2) return <CheckCircleIcon className="w-7 h-7 text-bluesky" />;
			return <CompactOutlineButton label={"Enable"} onClick={approveDepositTokenPermit2} />;
		} else {
			if (typeof depositTokenAllowance === "undefined" || depositTokenApprovalLoading)
				return <Spinner className="w-7 h-7 text-bluesky" />;
			if (enoughDepositAllowance) return <CheckCircleIcon className="w-7 h-7 text-bluesky" />;
			return <CompactOutlineButton label={"Approve"} onClick={approveDeposit} />;
		}
	}, [
		usePermit2,
		depositTokenPermit2,
		depositTokenPermit2ApprovalLoading,
		enoughDepositAllowance,
		depositTokenAllowance,
		depositTokenApprovalLoading,
		enoughDepositAllowance,
	]);

	const collateralAction = useMemo(() => {
		if (usePermit2) {
			if (typeof collateralTokenPermit2 === "undefined" || collateralTokenPermit2ApprovalLoading)
				return <Spinner className="w-7 h-7 text-bluesky" />;
			if (collateralTokenPermit2) return <CheckCircleIcon className="w-7 h-7 text-bluesky" />;
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
	]);

	const canJoin = useMemo(() => {
		console.log("balance", enoughBalance);
		console.log("permit2", usePermit2);
		console.log("signature", signature);
		if (!enoughBalance) return false;
		if (usePermit2) {
			return signature !== undefined ? true : false;
		} else if (!enoughDepositAllowance || !enoughCollateralAllowance) {
			return false;
		}
		return true;
	}, [enoughBalance, usePermit2, signature, enoughDepositAllowance, enoughCollateralAllowance]);

	const joinMode = useMemo(() => {
		return usePermit2 ? "permit" : "approval";
	}, [usePermit2]);

	const { join, isLoading: joinLoading } = useAgreementJoin({ mode: joinMode });

	return (
		<FlowModal show={isOpen} onClose={onClose}>
			<FlowModal.Header>
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
					<h3 className="text-slate-600 md:text-xl text-xl font-semibold">{"Join Agreement"}</h3>
				</div>
			</FlowModal.Header>
			<div className="flex flex-col items-center justify-center pt-4">
				<div className="flex flex-col w-full items-start px-8 pt-3 pb-8 gap-1 text-slate-400 text-sm">
					<div className="flex w-full md:w-2/3">
						{/* <h3 className="text-sm text-slate-400 px-2 mb-1">{t("join.tokenSummary")}</h3> */}
						<h3 className="mb-3">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget
							tincidunt lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet
						</h3>
					</div>
					<div className="flex w-full items-center justify-end gap-2 py-2 border-b">
						<div className="flex w-full items-center justify-end gap-1">
							<p>Gasless approvals</p>
							<InfoTooltip info={t("agreement.depositInfo")} className="w-5 h-5" />
						</div>
						<Toggle onToggle={(checked) => setUsePermit2(checked)} />
					</div>
					<AssetDisplay
						title={"Dispute deposit"}
						amount={requiredDeposit}
						symbol={depositToken?.symbol ?? ""}
						info={t("agreement.depositInfo")}
						warning={"Not enough balance"}
						showWarning={!enoughDeposit}
						action={depositAction}
					/>
					<AssetDisplay
						title={"Collateral"}
						amount={requiredCollateral}
						symbol={collateralToken?.symbol ?? ""}
						info={t("agreement.collateralInfo")}
						warning={"Not enough balance"}
						showWarning={!enoughCollateral}
						action={collateralAction}
					/>
					<div className="flex w-full min-h-[3.5rem]">
						{usePermit2 && (
							// Button to sign permit2
							<div className="flex w-full justify-between items-start gap-2 pt-3 pb-2">
								<span className="flex items-center gap-1">
									<span className="text-lg">Approve token transfers gasless</span>
									<InfoTooltip info={""} className="w-4 h-4" />
								</span>
								<div className="flex w-fit">
									<CompactOutlineButton label={"Approve transfers"} onClick={() => signPermit()} />
								</div>
							</div>
						)}
					</div>
					<div className="flex w-full justify-end mt-5">
						<OutlineButton
							label="Join Agreement"
							disabled={!canJoin}
							loading={joinLoading}
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
		</FlowModal>
	);
};