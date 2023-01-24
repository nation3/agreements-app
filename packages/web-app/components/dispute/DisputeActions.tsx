import { useState, useEffect, useMemo } from "react";
import { Button, IStep, Steps } from "@nation3/ui-components";
import { constants } from "ethers";
import { Modal as FlowModal } from "flowbite-react";
import Image from "next/image";

import { useDispute } from "./context/DisputeResolutionContext";
import { ResolutionDetails } from "./ResolutionDetails";
import { ResolutionForm } from "./ResolutionForm";
import { useResolutionAppeal } from "../../hooks/useArbitrator";
import { AgreementDisputedAlert } from "../alerts";
import courtIcon from "../../assets/svgs/court.svg";
import nationCoinIcon from "../../assets/svgs/nation_coin.svg";
import joinedIcon from "../../assets/svgs/joined.svg";
import { usePermit2Allowance, usePermit2TransferSignature } from "../../hooks/usePermit2";
import { useAccount } from "wagmi";
import { arbitratorAddress, NATION } from "../../lib/constants";

export const DisputeArbitrationActions = () => {
	const [mode, setMode] = useState("view");
	const { dispute, resolution } = useDispute();

	if (dispute.status == "Closed") return <></>;
	if (mode == "edit") {
		return <ResolutionForm />;
	} else if (resolution == undefined) {
		return <Button label="Propose a settlement" onClick={() => setMode("edit")} />;
	} else {
		return <Button label="Propose a new settlement" onClick={() => setMode("edit")} />;
	}
};

export const DisputeActions = () => {
	const { address } = useAccount();
	const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
	const [stepsIndex, setStepsIndex] = useState(0);
	const [stepsLoadingIndex, setStepsLoadingIndex] = useState<number | null>(null);
	const { resolution } = useDispute();
	const { appeal, isTxSuccess: isAppealSuccess, isError: isAppealError } = useResolutionAppeal();

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
		tokenTransfer: { token: NATION, amount: 0 },
		spender: arbitratorAddress,
	});

	useEffect(() => {
		if (isAppealSuccess || isAppealError) {
			setStepsLoadingIndex(null);
			window.location.reload();
		}
	}, [isAppealSuccess, isAppealError]);

	useEffect(() => {
		if (approvalSuccess || approvalError) {
			setStepsLoadingIndex(null);
		}
	}, [approvalSuccess, approvalError]);

	useEffect(() => {
		// TODO: Built in this logic into the Steps component
		if (signSuccess) {
			setStepsLoadingIndex(null);
		}
	}, [signSuccess, signError]);

	const canAppeal = useMemo(() => {
		const partOfSettlement = resolution?.settlement?.find(({ party }) => party == address);
		return partOfSettlement ? true : false;
	}, [address, resolution]);

	const steps: IStep[] = [
		{
			title: "Setup Permit2",
			description: (
				<div>
					<p className="text-xs text-gray-400">
						Approve Permit2 to manage token transfers (extend & link to docs).
					</p>
				</div>
			),
			image: nationCoinIcon,
			stepCTA: "Setup Permit2",
			action: () => {
				setStepsLoadingIndex(0);
				approveAppealToken();
			},
		},
		{
			title: "Approve Tokens",
			description: (
				<div>
					<p className="text-xs text-gray-400">
						Sign a permit to transfer the required tokens to appeal the resolution (extend & link to
						docs).
					</p>
				</div>
			),
			image: nationCoinIcon,
			stepCTA: "Sign",
			action: () => {
				setStepsLoadingIndex(1);
				signPermit();
			},
		},
		{
			title: "Appeal Resolution",
			description: (
				<div>
					<p className="text-xs mb-1 text-gray-500">
						The required tokens will be transfered from your account and the resolution will be
						appealed.
					</p>
					<p className="text-xs mb-1 text-gray-500">
						<span className="font-semibold text-bluesky-500">{0} $NATION:</span>
						<span className="text-gray-400"> Appeal cost</span>
					</p>
				</div>
			),
			image: joinedIcon,
			stepCTA: "Appeal resolution",
			action: () => {
				setStepsLoadingIndex(2);
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
		const index = appealTokenApproved ? (signature ? 2 : 1) : 0;
		setStepsIndex(index);
	}, [appealTokenApproved, signature]);

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

							{resolution.status == "Approved" && (
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
								<Steps
									steps={steps}
									icon={courtIcon}
									title={"Appeal Resolution"}
									stepIndex={stepsIndex}
									loadingIndex={stepsLoadingIndex}
								/>
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
				<Button
					label="Submit evidence"
					onClick={() =>
						window.open("https://docs.nation3.org/agreements/submitting-evidence", "_blank")
					}
				/>
			</>
		);
	}
};
