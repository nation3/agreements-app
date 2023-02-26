import { Tooltip } from "flowbite-react";
import { useMemo, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { BigNumber, BigNumberish, constants, utils } from "ethers";
import { useAgreementJoin } from "../../../hooks/useAgreement";
import { UserPosition } from "../context/types";
import Image from "next/image";
import { Button, Steps, IStep } from "@nation3/ui-components";
import { Modal as FlowModal } from "flowbite-react";
import courtIcon from "../../../public/svgs/court.svg";
import nationCoinIcon from "../../../public/svgs/nation_coin.svg";
import joinedIcon from "../../../public/svgs/joined.svg";
import { usePermit2Allowance, usePermit2BatchTransferSignature } from "../../../hooks/usePermit2";
import { useTranslation } from "next-i18next";
import { ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { Permit2Setup } from "../../Permit2Setup";
import { useTokenBalance } from "../../../hooks/useToken";
import { GradientLink } from "../../GradientLink";
import { useConstants } from "../../../hooks/useConstants";
import { useAgreementData } from "../context/AgreementDataContext";

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

interface TokenDisplay {
	amount: BigNumber;
	symbol: string;
}

const TokenSummary = ({
	// balance,
	deposit,
	collateral,
	enoughDeposit = true,
	enoughCollateral = true,
}: {
	// balance: BigNumber;
	deposit: TokenDisplay;
	collateral: TokenDisplay;
	enoughDeposit?: boolean;
	enoughCollateral?: boolean;
}) => {
	const { t } = useTranslation("common");

	// const formattedBalance = balance ? utils.formatUnits(balance) : "";

	return (
		<div className="flex flex-col w-full items-start px-8 md:px-20 py-7 gap-1">
			{/* <h3 className="text-sm text-slate-400 px-2 mb-1">{t("join.yourBalance")}</h3> */}
			{/* <p className="text-sm flex justify-between items-center gap-5 px-2 text-gray-500"> */}
			{/* <span className="font-semibold text-bluesky-500">{formattedBalance} $NATION</span> */}
			{/* TODO: Refactor eval */}
			{/*!balance.gte(deposit.add(collateral)) && (
					<span className="flex items-center gap-1">
						⚠️ Get some
						<a href="https://app.balancer.fi/#/ethereum/trade/ether/0x333A4823466879eeF910A04D473505da62142069">
							<GradientLink
								href="https://docs.nation3.org/agreements/creating-an-agreement"
								caption="$NATION"
							/>
						</a>
					</span>
				)*/}
			{/* </p> */}
			{/* <hr className="border-b mb-2"></hr> */}
			<h3 className="text-sm text-slate-400 px-2 mb-1">{t("join.tokenSummary")}</h3>
			<p className="flex text-sm justify-between items-center gap-5 px-2 text-gray-500">
				<span className="font-semibold text-bluesky-500">
					{utils.formatUnits(deposit.amount)} ${deposit.symbol}
				</span>
				<span className="flex items-center gap-1">
					<span className="text-gray-400">Dispute deposit</span>
					<InfoTooltip info={t("agreement.depositInfo")} className="w-4 h-4" />
					{!enoughDeposit && (
						<WarningTooltip info={"Not enough balance"} className="w-4 h-4 text-yellow-500" />
					)}
				</span>
			</p>
			<p className="text-sm flex justify-between items-center gap-5 px-2 text-gray-500">
				<span className="font-semibold text-bluesky-500">
					{utils.formatUnits(collateral.amount)} ${collateral.symbol}
				</span>
				<span className="flex items-center gap-1">
					<span className="text-gray-400">Collateral</span>
					<InfoTooltip info={t("agreement.collateralInfo")} className="w-4 h-4" />
					{!enoughCollateral && (
						<WarningTooltip info={"Not enough balance"} className="w-4 h-4 text-yellow-500" />
					)}
				</span>
			</p>
		</div>
	);
};

export const JoinableAgreementActions = ({
	id,
	userPosition,
}: {
	id: string;
	userPosition: UserPosition;
}) => {
	const { frameworkAddress, NATION } = useConstants();
	const { t } = useTranslation("common");
	const { address } = useAccount();
	const { disputeCost: requiredDeposit, collateralToken, depositToken } = useAgreementData();
	const [isJoinAgreementModalOpen, setIsJoinAgreementModalOpen] = useState<boolean>(false);
	const [stepsIndex, setStepsIndex] = useState<number>(0);
	const [isStepLoading, setStepLoading] = useState<boolean>(false);
	const [stepsError, setStepsError] = useState<{
		header: string;
		description: string;
		isError: boolean;
	}>({
		header: "",
		description: "",
		isError: false,
	});

	/* JOIN PRE-REQUIREMENTS */

	const userResolver = useMemo(
		() => ({
			account: address || constants.AddressZero,
			balance: userPosition.resolver?.balance || "0",
			proof: userPosition.resolver?.proof || [],
		}),
		[address, userPosition],
	);

	const requiredCollateral = useMemo((): BigNumber => {
		return BigNumber.from(userPosition.resolver?.balance || 0);
	}, [userPosition]);

	const {
		isEnough: depositTokenApproved,
		approve: approveDepositToken,
		// approvalSuccess: depositApprovalSuccess,
		// approvalError: depositApprovalError,
	} = usePermit2Allowance({
		token: depositToken?.address ?? constants.AddressZero,
		account: address ?? constants.AddressZero,
		enabled: !!address && !!depositToken?.address,
	});

	const {
		isEnough: collateralTokenApproved,
		approve: approveCollateralToken,
		// approvalSuccess: collateralApprovalSuccess,
		// approvalError: collateralApprovalError,
	} = usePermit2Allowance({
		token: collateralToken?.address ?? constants.AddressZero,
		account: address ?? constants.AddressZero,
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

	const enoughDeposit = useMemo((): boolean => {
		return depositUserBalance.gte(requiredDeposit);
	}, [depositUserBalance, requiredDeposit]);

	const enoughCollateral = useMemo((): boolean => {
		return collateralUserBalance.gte(requiredCollateral);
	}, [collateralUserBalance, requiredCollateral]);

	const missingNATION = useMemo((): boolean => {
		if (isSameToken) {
			return depositUserBalance.lt(requiredDeposit.add(requiredCollateral));
		}
		return !enoughDeposit;
	}, [isSameToken, requiredDeposit, requiredCollateral, depositUserBalance, enoughDeposit]);

	const enoughBalance = useMemo((): boolean => {
		if (isSameToken) {
			return depositUserBalance.gte(requiredDeposit.add(requiredCollateral));
		}
		return depositUserBalance.gte(requiredDeposit) && collateralUserBalance.gte(requiredCollateral);
	}, [isSameToken, depositUserBalance, collateralUserBalance, requiredDeposit, requiredCollateral]);

	const permitTokens = useMemo(() => {
		const tokens = [
			{
				address: depositToken?.address ?? constants.AddressZero,
				name: depositToken?.symbol ?? "NATION",
				isApproved: depositTokenApproved,
				approve: approveDepositToken,
			},
		];
		if (depositToken?.address !== collateralToken?.address) {
			tokens.push({
				address: collateralToken?.address ?? constants.AddressZero,
				name: collateralToken?.symbol ?? "NATION",
				isApproved: collateralTokenApproved,
				approve: approveCollateralToken,
			});
		}
		return tokens;
	}, [depositToken, collateralToken, depositTokenApproved, approveDepositToken]);

	/* PERMIT SIGNATURE */

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

	useEffect(() => {
		// TODO: Built in this logic into the Steps component
		if (signSuccess || signError) {
			setStepLoading(false);
		}
	}, [signSuccess, signError]);

	/* STEPS 2 - SIGN */

	const { join, isTxSuccess: isJoinSuccess, isError: isJoinError } = useAgreementJoin();

	useEffect(() => {
		if (isJoinSuccess) {
			setStepLoading(false);
			window.location.reload();
		} else if (isJoinError) {
			setStepLoading(false);
			setStepsError({
				header: "Join Agreement failed",
				description: t("join.joinAgreement.error"),
				isError: true,
			});
		}
	}, [isJoinSuccess, isJoinError, t]);

	// FIXME: Better step index selector
	useEffect(() => {
		setStepsIndex(signature ? 1 : 0);
		// TODO: Rethink this, array mode steps are definetly not the best.
		/* 		const manageSteps = [...stepsBase];
		Array.from(Array(index).keys()).forEach(() => {
						manageSteps.shift();
		}); */
	}, [signature]);

	const steps: IStep[] = [
		{
			title: t("join.permitSignature.title"),
			description: (
				<div>
					<p className="text-xs text-gray-400">{t("join.permitSignature.description")}</p>
				</div>
			),
			image: nationCoinIcon,
			stepCTA: t("join.permitSignature.action") as string,
			action: () => {
				setStepLoading(true);
				signPermit();
			},
		},
		{
			title: t("join.joinAgreement.title"),
			description: (
				<div>
					<p className="text-xs mb-1 text-gray-500">{t("join.joinAgreement.description")}</p>
				</div>
			),
			image: joinedIcon,
			stepCTA: t("join.joinAgreement.action") as string,
			action: () => {
				setStepLoading(true);
				join({ id, resolver: userResolver, permit, signature });
			},
		},
	];

	return (
		<>
			{/* 
			//TODO: Build Global UI Context for generic modals and UI Warns
				TX ERROR MODAL
			*/}
			<FlowModal
				show={stepsError.isError}
				onClose={() => setStepsError({ ...stepsError, isError: false })}
			>
				<FlowModal.Header>{stepsError.header}</FlowModal.Header>
				<FlowModal.Body>
					<div className="space-y-6">
						<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
							{stepsError.description}
						</p>
					</div>
				</FlowModal.Body>
			</FlowModal>

			<div className="flex flex-col gap-1">
				<Button label="Join Agreement" onClick={() => setIsJoinAgreementModalOpen(true)} />

				<FlowModal
					show={isJoinAgreementModalOpen}
					onClose={() => setIsJoinAgreementModalOpen(false)}
				>
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
							<h3 className="text-slate-600 md:text-xl text-xl font-semibold">
								{"Join Agreement"}
							</h3>
						</div>
					</FlowModal.Header>
					<div className="flex flex-col items-center justify-center pt-4 border-t-2 border-bluesky-200">
						{depositTokenApproved && collateralTokenApproved ? (
							<>
								<TokenSummary
									deposit={{ symbol: depositToken?.symbol ?? "", amount: requiredDeposit }}
									collateral={{ symbol: collateralToken?.symbol ?? "", amount: requiredCollateral }}
									enoughDeposit={enoughDeposit}
									enoughCollateral={enoughCollateral}
								/>
								{missingNATION && (
									<span className="flex items-center gap-1">
										Get some
										<a href="https://app.balancer.fi/#/ethereum/trade/ether/0x333A4823466879eeF910A04D473505da62142069">
											<GradientLink
												href="https://docs.nation3.org/agreements/creating-an-agreement"
												caption="$NATION"
											/>
										</a>
									</span>
								)}
								<div className="flex w-full px-8 my-5">
									<hr className="w-full" />
								</div>
								<Steps
									isCTAdisabled={!enoughBalance}
									steps={steps}
									icon={courtIcon}
									title={"Join Agreement"}
									stepIndex={stepsIndex}
									isStepLoading={isStepLoading}
								/>
							</>
						) : (
							<Permit2Setup tokens={permitTokens} />
						)}
					</div>
				</FlowModal>
			</div>
		</>
	);
};
