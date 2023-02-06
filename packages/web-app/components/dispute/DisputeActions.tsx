import { useState, useEffect, useMemo } from "react";
import { Button, IStep, Steps } from "@nation3/ui-components";
import { constants } from "ethers";
import { Modal as FlowModal } from "flowbite-react";
import Image from "next/image";
import { utils } from "ethers";

import { useDispute } from "./context/DisputeResolutionContext";
import { ResolutionDetails } from "./ResolutionDetails";
import { ResolutionForm } from "./ResolutionForm";
import { useResolutionAppeal, useResolutionExecute } from "../../hooks/useArbitrator";
import { AgreementDisputedAlert } from "../alerts";
import courtIcon from "../../assets/svgs/court.svg";
import nationCoinIcon from "../../assets/svgs/nation_coin.svg";
import joinedIcon from "../../assets/svgs/joined.svg";
import { usePermit2Allowance, usePermit2TransferSignature } from "../../hooks/usePermit2";
import { useAccount } from "wagmi";
import { Permit2Setup } from "../Permit2Setup";
import { useTranslation } from "next-i18next";
import { useConstants } from "../../hooks/useConstants";

export const DisputeArbitrationActions = () => {
	const [mode, setMode] = useState("view");
	const { dispute, resolution, proposedResolutions } = useDispute();

	if (dispute.status == "Closed" || proposedResolutions.length > 0) return <></>;
	if (mode == "edit") {
		return <ResolutionForm />;
	} else if (resolution == undefined) {
		return <Button label="Propose a settlement" onClick={() => setMode("edit")} />;
	} else {
		return <Button label="Propose a new settlement" onClick={() => setMode("edit")} />;
	}
};

export const DisputeActions = () => {
	const { t } = useTranslation("common");
	const { address } = useAccount();
	// FIXME: Fetch from arbitrator
	const [appealCost] = useState(0);
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
		tokenTransfer: { token: NATION, amount: appealCost },
		spender: arbitratorAddress,
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
		return currentTime ? resolution.unlockTime < currentTime : false;
	}, [resolution]);

	if (resolution) {
		return (
			<div className="flex flex-col gap-2">
				<div>
					<div className="bg-gray-100 rounded-xl">
						<div className="flex flex-col py-2 px-4 text-base font-normal text-gray-700">
							<span>This dispute has been arbitrated by the court.</span>
						</div>
						<div className="flex flex-col gap-2 p-4 pb-2 border-4 border-gray-100 rounded-xl bg-white">
							<ResolutionDetails />
							{canBeEnacted && (
								<Button
									label="Enact"
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
									disabled={!canAppeal}
									onClick={() => setIsAppealModalOpen(true)}
								/>
							)}
							<FlowModal show={isAppealModalOpen} onClose={() => setIsAppealModalOpen(false)}>
								<FlowModal.Header>
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
								</FlowModal.Header>
								<div className="flex flex-col items-center justify-center pt-8 border-t-2 border-bluesky-200">
									{appealTokenApproved ? (
										<>
											<div className="flex flex-col w-full items-start px-20 py-7 gap-1">
												<p className="flex justify-between gap-5 px-2 py-1 text-gray-500">
													<span className="font-semibold text-bluesky">
														{utils.formatUnits(appealCost)} $NATION
													</span>
													<span className="text-gray-400">Appeal cost</span>
												</p>
											</div>
											<div className="flex w-full px-8 my-5">
												<hr className="w-full" />
											</div>
											<Steps
												steps={steps}
												icon={courtIcon}
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
							</FlowModal>
						</div>
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
