import {
	Body3,
	BodyHeadline,
	Button,
	Card,
	IStep,
	OrbitingOrbGreen,
	Steps,
	ModalNew,
} from "@nation3/ui-components";
import { BigNumber, constants, utils } from "ethers";
import { Modal as FlowModal } from "flowbite-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "next-i18next";
import { useAccount } from "wagmi";
import { useResolutionAppeal, useResolutionExecute } from "../../hooks/useArbitrator";
import { useConstants } from "../../hooks/useConstants";
import { usePermit2Allowance, usePermit2TransferSignature } from "../../hooks/usePermit2";
import { useTokenBalance } from "../../hooks/useToken";
import courtIcon from "../../public/svgs/court.svg";
import joinedIcon from "../../public/svgs/joined.svg";
import nationCoinIcon from "../../public/svgs/nation_coin.svg";
import { GradientLink } from "../GradientLink";
import { Permit2Setup } from "../Permit2Setup";
import { AgreementDisputedAlert } from "../alerts";
import { ResolutionForm } from "./ResolutionForm";
import { useDispute } from "./context/DisputeResolutionContext";

export const DisputeArbitrationActions = () => {
	const [mode, setMode] = useState("view");
	const { dispute, resolution, proposedResolutions } = useDispute();

	if (dispute.status == "Closed" || proposedResolutions.length > 0) return <></>;
	if (mode == "edit") {
		return <ResolutionForm />;
	} else if (resolution == undefined) {
		return (
			<Card className="">
				<Button label="Propose a settlement" onClick={() => setMode("edit")} />
			</Card>
		);
	} else {
		return (
			<Card className="">
				<Button label="Propose a new settlement" onClick={() => setMode("edit")} />
			</Card>
		);
	}
};

export const DisputeActions = () => {
	const { t } = useTranslation("common");
	const { address } = useAccount();
	const { appealCost } = useDispute();
	const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
	const [stepsIndex, setStepsIndex] = useState(0);
	const [isStepLoading, setStepLoading] = useState<boolean>(false);
	const { dispute, resolution } = useDispute();
	const { execute, isTxSuccess: isExecuteSuccess } = useResolutionExecute();
	const { appeal, isTxSuccess: isAppealSuccess, isError: isAppealError } = useResolutionAppeal();
	const { frameworkAddress, NATION, arbitratorAddress } = useConstants();

	const {
		isEnough: appealTokenApproved,
		approve: approveAppealToken,
		approvalSuccess,
		approvalError,
	} = usePermit2Allowance({
		token: NATION,
		account: address || constants.AddressZero,
	});

	const { permit, signature, signPermit, signSuccess, signError } = usePermit2TransferSignature({
		tokenTransfer: { token: NATION, amount: appealCost ?? BigNumber.from(0) },
		spender: arbitratorAddress,
		address: address ?? constants.AddressZero,
	});

	useEffect(() => {
		if (isAppealSuccess || isAppealError) {
			setStepLoading(false);
		}
	}, [isAppealSuccess, isAppealError]);

	useEffect(() => {
		if (isAppealSuccess || isExecuteSuccess) window.location.reload();
	}, [isAppealSuccess, isExecuteSuccess]);

	useEffect(() => {
		if (approvalSuccess || approvalError) {
			setStepLoading(false);
		}
	}, [approvalSuccess, approvalError]);

	useEffect(() => {
		// TODO: Built in this logic into the Steps component
		if (signSuccess || signError) {
			setStepLoading(false);
		}
	}, [signSuccess, signError]);

	const canAppeal = useMemo(() => {
		if (!resolution) return false;
		if (resolution.status != "Approved") return false;
		const currentTime = Math.floor(Date.now() / 1000);
		if (currentTime && resolution.unlockTime < currentTime) return false;
		const partOfSettlement = resolution?.settlement?.find(({ party }) => party == address);
		return partOfSettlement ? true : false;
	}, [address, resolution]);

	const steps: IStep[] = [
		{
			title: t("appeal.permitSignature.title"),
			description: (
				<div>
					<p className="text-xs text-gray-400">{t("appeal.permitSignature.description")}</p>
				</div>
			),
			image: nationCoinIcon,
			stepCTA: t("appeal.permitSignature.action") as string,
			action: () => {
				setStepLoading(true);
				signPermit();
			},
		},
		{
			title: t("appeal.appealResolution.title"),
			description: (
				<div>
					<p className="text-xs mb-1 text-gray-500">{t("appeal.appealResolution.description")}</p>
				</div>
			),
			image: joinedIcon,
			stepCTA: t("appeal.appealResolution.action") as string,
			action: () => {
				setStepLoading(true);
				appeal({
					id: resolution?.id || constants.HashZero,
					settlement: resolution?.settlement || [],
					permit,
					signature,
				});
			},
		},
	];

	// FIXME: Better step index selector
	useEffect(() => {
		setStepsIndex(signature ? 1 : 0);
	}, [signature]);

	const canBeEnacted = useMemo(() => {
		const currentTime = Math.floor(Date.now() / 1000);
		if (!resolution) return false;
		if (resolution.status == "Appealed") return false;
		if (resolution.status == "Endorsed") return true;
		return currentTime ? resolution.unlockTime < currentTime : false;
	}, [resolution]);

	const { balance: nationBalance } = useTokenBalance({
		address: NATION,
		account: address || constants.AddressZero,
	});

	const formattedBalance = nationBalance ? utils.formatUnits(nationBalance) : "";

	if (resolution) {
		return (
			<div className="flex flex-col gap-2">
				<div>
					<div className="w-full flex-col items-stretch h-full flex justify-between gap-min3">
						{!canBeEnacted && !canAppeal ? (
							<div className="flex flex-col justify-between">
								{/* <img src={OrbitingOrbGreenUrl}></img> */}
								<OrbitingOrbGreen className="h-[85px] w-[85px] mb-base" />
								<BodyHeadline>No actions</BodyHeadline>
								<Body3 className="text-slate-500 text-sm mt-min2">
									This dispute has been arbitrated by the court.
								</Body3>
							</div>
						) : (
							<div className="text-neutral-c-700 flex flex-col justify-between gap-min3">
								<div className="flex items-center mr-min3">
									<BodyHeadline color="neutral-c-800">Appeal resolution</BodyHeadline>
								</div>
								<Body3 color="neutral-c-700">This dispute has been arbitrated by the court.</Body3>
							</div>
						)}
						{canBeEnacted && (
							<Button
								label="Enact"
								className="border-sc-c-orange3"
								disabled={!canBeEnacted}
								onClick={() =>
									execute({
										framework: frameworkAddress,
										dispute: dispute.id,
										settlement: resolution.settlement || [],
									})
								}
							/>
						)}
						{canAppeal && (
							<Button
								label="Appeal"
								className="border-sc-c-orange3"
								disabled={!canAppeal}
								onClick={() => setIsAppealModalOpen(true)}
							/>
						)}
						<ModalNew isOpen={isAppealModalOpen} onClose={() => setIsAppealModalOpen(false)}>
							<section className="bg-white rounded-lg shadow w-full max-w-2xl overflow-hidden border-sc-c-orange1 border-2">
								<header className="bg-white border-b-2 border-sc-c-orange1 p-base">
									<div className="flex items-center w-full pl-3">
										{courtIcon && (
											<div className="overflow-hidden flex items-center justify-center h-1/2 mr-6">
												<Image
													className="h-full"
													width={40}
													height={40}
													src={courtIcon}
													alt={"Appeal Resolution"}
												/>
											</div>
										)}
										<h3 className="text-slate-600 md:text-xl text-xl font-semibold">
											{"Appeal Resolution"}
										</h3>
									</div>
								</header>
								<div className="flex flex-col justify-center border-bluesky-200">
									{appealTokenApproved ? (
										<>
											<div className="flex flex-col w-full mt-8 items-start px-8 md:px-20 py-3 gap-1">
												<h3 className="text-sm text-slate-400 px-2 mb-1">
													{t("dispute.yourBalance")}
												</h3>
												<p className="flex justify-between items-center gap-5 px-2 text-bluesky-500">
													<span className="font-semibold ">{formattedBalance} $NATION</span>
													{/* TODO: Refactor eval */}
													{(parseInt(formattedBalance) === 0 ||
														parseInt(utils.formatUnits(appealCost ?? BigNumber.from(0))) >
															parseInt(formattedBalance)) && (
														<span className="flex items-center gap-1">
															⚠️ Get some
															<a href="https://app.balancer.fi/#/ethereum/trade/ether/0x333A4823466879eeF910A04D473505da62142069">
																<GradientLink
																	href="https://docs.nation3.org/agreements/creating-an-agreement"
																	caption="$NATION"
																/>
															</a>
														</span>
													)}
												</p>
												<hr className="border-b"></hr>
												<div className="flex flex-col w-full items-start gap-1 mb-1">
													<h3 className="text-sm text-slate-400 px-2">Appeal cost</h3>
													<p className="flex justify-between gap-5 px-2 font-semibold text-bluesky-500">
														<span>
															{utils.formatUnits(appealCost ?? BigNumber.from(0))} $NATION
														</span>
													</p>
												</div>
											</div>
											<div className="flex w-full px-8 my-5">
												<hr className="w-full" />
											</div>
											<Steps
												steps={steps}
												icon={courtIcon}
												isCTAdisabled={
													parseInt(formattedBalance) === 0 ||
													parseInt(utils.formatUnits(appealCost ?? BigNumber.from(0))) >
														parseInt(formattedBalance)
												}
												title={"Appeal Resolution"}
												stepIndex={stepsIndex}
												isStepLoading={isStepLoading}
											/>
										</>
									) : (
										<Permit2Setup
											tokens={[
												{
													address: NATION,
													name: "NATION",
													isApproved: appealTokenApproved,
													approve: approveAppealToken,
												},
											]}
										/>
									)}
								</div>
							</section>
						</ModalNew>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<>
				<AgreementDisputedAlert />
				{/* <Button
					label="Submit evidence"
					onClick={() =>
						window.open("https://docs.nation3.org/agreements/submitting-evidence", "_blank")
					}
				/> */}
				<div>
					<p className="text-slate-500 text-md p-4">
						Submit your evidence to support your dispute.{" "}
						<a
							className="underline"
							href="https://docs.nation3.org/agreements/submitting-evidence"
							target="_blank"
							rel="noreferrer"
						>
							Submit process
						</a>
					</p>
				</div>
			</>
		);
	}
};
