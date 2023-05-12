import { Body1, Body3, BodyHeadline, Button, IconRenderer, ModalNew } from "@nation3/ui-components";
import { BigNumber, utils } from "ethers";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAgreementDispute, useAgreementFinalize } from "../../../hooks";
import disputeIcon from "../../../public/svgs/dispute-icon.svg";
import finalizeIcon from "../../../public/svgs/finalize-icon.svg";
import { useAgreementData } from "../context/AgreementDataContext";

export const JoinedAgreementActions = ({ id }: { id: string }) => {
	const { userPosition, depositToken, collateralToken } = useAgreementData();
	const { t } = useTranslation("common");
	const [showDisputeModal, setDisputeModalVisibility] = useState(false);
	const [showFinalizeModal, setFinalizeModalVisibility] = useState(false);

	const {
		dispute,
		isLoading: disputeLoading,
		isProcessing: disputeProcessing,
		isTxSuccess: isDisputeSuccess,
	} = useAgreementDispute({ id });
	const {
		finalize,
		isLoading: finalizationLoading,
		isProcessing: finalizationProcessing,
		isTxSuccess: isFinalizeSuccess,
	} = useAgreementFinalize({ id });

	useEffect(() => {
		if (isDisputeSuccess || isFinalizeSuccess) {
			window.location.reload();
		}
	}, [isDisputeSuccess, isFinalizeSuccess]);

	const disputeButtonLoading = useMemo(
		() => disputeLoading || disputeProcessing,
		[disputeLoading, disputeProcessing],
	);

	const finalizeButtonLoading = useMemo(
		() => finalizationLoading || finalizationProcessing,
		[finalizationLoading, finalizationProcessing],
	);

	return (
		<>
			<div className="grid grid-cols-1 gap-double">
				{/* 
				FINALISE ACTION BLOCK
				 */}
				<section className="grid grid-cols-1 gap-min3">
					<div className="w-full flex-col items-stretch h-full flex justify-between gap-min3">
						<div className="flex flex-col justify-between gap-min3">
							<div className="flex items-center mr-min3">
								<BodyHeadline color="neutral-c-800">
									{t("agreementActions.finalizeHeadline")}
								</BodyHeadline>
							</div>
							<Body3 color="neutral-c-500" className="text-sm ">
								{t("agreementActions.finalizeDescription")}
							</Body3>
						</div>
						<Button
							outlined
							label={t("agreementActions.finalizeCTA")}
							onClick={() => setFinalizeModalVisibility(true)}
						/>
					</div>
				</section>

				{/* 
				DISPUTE ACTION BLOCK
				 */}
				<section className="grid grid-cols-1 gap-min3">
					<div className="w-full flex-col items-stretch h-full flex justify-between gap-min3">
						<div className="flex flex-col justify-between gap-min3">
							<div className="flex items-center mr-min3">
								<BodyHeadline color="neutral-c-800">
									{t("agreementActions.disputeHeadline")}
								</BodyHeadline>
							</div>
							<Body3 color="neutral-c-500" className="text-sm ">
								{t("agreementActions.disputeDescription")}
							</Body3>
						</div>
						<Button
							className="border-sc-c-orange3"
							outlined
							label={t("agreementActions.disputeCTA")}
							onClick={() => setDisputeModalVisibility(true)}
						/>
					</div>
				</section>
			</div>

			{/* 

			DISPUTE MODAL
			
			*/}
			<ModalNew isOpen={showDisputeModal} onClose={() => setDisputeModalVisibility(false)}>
				<section className="bg-white rounded-lg shadow w-full max-w-2xl overflow-hidden border-sc-c-orange1 border-2">
					<header className="bg-white border-b-2 border-sc-c-orange1 p-base">
						<div className="flex items-center w-full">
							<IconRenderer
								icon={
									<Image
										className="h-full"
										width={40}
										height={40}
										src={disputeIcon}
										alt={"Dispute Agreement"}
									/>
								}
								backgroundColor={"neutral-c-200"}
								size={"sm"}
							/>
							<BodyHeadline color="neutral-c-600" className="text-xl ml-base">
								{t("dispute.title")}
							</BodyHeadline>
						</div>
					</header>
					<div className="flex flex-col items-center justify-center text-neutral-c-500 px-base+ py-base+ w-full">
						<div className="mb-base">
							<div className="md:max-w-[66%]">{t("dispute.description")}</div>
							<hr className="md:w-2/5 my-7" />
							<div className="flex flex-col gap-4">
								<div>
									<Body1 color="neutral-c-700">{t("dispute.disputeCost.title")}</Body1>
									<BodyHeadline color="neutral-c-800">{`${utils.formatUnits(
										userPosition?.deposit ?? 0,
									)} $NATION`}</BodyHeadline>
									<Body3 color="neutral-c-400">{t("dispute.disputeCost.description")}</Body3>
								</div>
								<div>
									<Body1 color="neutral-c-700">{t("dispute.evidenceSubmission.title")}</Body1>
									<BodyHeadline color="neutral-c-800">{"5 days"}</BodyHeadline>
									<Body3 color="neutral-c-400">{t("dispute.disputeCost.description")}</Body3>
								</div>
								<div>
									<Body1 color="neutral-c-700">{t("dispute.disputeResolution.title")}</Body1>
									<Body3 color="neutral-c-400">{t("dispute.disputeResolution.description")}</Body3>
								</div>
							</div>
						</div>
						<div className="flex justify-end w-full">
							<Button
								className="border-sc-c-orange3"
								label="Confirm Dispute"
								isLoading={disputeButtonLoading}
								onClick={() => dispute()}
							/>
						</div>
					</div>
				</section>
			</ModalNew>

			{/* 

			FINALISE MODAL
			
			*/}
			<ModalNew isOpen={showFinalizeModal} onClose={() => setFinalizeModalVisibility(false)}>
				<section className="bg-white rounded-lg shadow w-full max-w-2xl overflow-hidden border-neutral-c-300 border-2">
					<header className="bg-white border-b-2 border-neutral-c-300 p-base">
						<div className="flex items-center w-full">
							<IconRenderer
								icon={
									<Image
										className="h-full"
										width={40}
										height={40}
										src={finalizeIcon}
										alt={"Finalize Agreement"}
									/>
								}
								backgroundColor={"neutral-c-200"}
								size={"sm"}
							/>
							<BodyHeadline color="neutral-c-600" className="text-xl ml-base">
								{t("finalize.title")}
							</BodyHeadline>
						</div>
					</header>
					<div className="flex flex-col items-center justify-center text-neutral-c-500 px-base+ py-base+ w-full">
						<div className="mb-base">
							<div className="md:max-w-[66%]">{t("finalize.description")}</div>
							<hr className="md:w-2/5 my-7" />
							<div className="flex flex-col gap-min3">
								<Body1 color="neutral-c-700">{t("finalize.tokenWithdrawal.title")}</Body1>
								<div className="flex flex-col">
									<Body1 color="neutral-c-600">Dispute deposit</Body1>
									<BodyHeadline color="neutral-c-800">
										<span>
											{utils.formatUnits(userPosition?.deposit ?? 0)} ${depositToken?.symbol ?? ""}
										</span>
									</BodyHeadline>
								</div>
								<div className="flex flex-col">
									<Body1 color="neutral-c-600">Collateral</Body1>
									<BodyHeadline color="neutral-c-800">
										<span>
											{utils.formatUnits(BigNumber.from(userPosition?.collateral || 0))} $
											{collateralToken?.symbol ?? ""}
										</span>
									</BodyHeadline>
								</div>
								<Body3 color="neutral-c-400">{t("finalize.tokenWithdrawal.description")}</Body3>
							</div>
						</div>
						<div className="flex justify-end w-full">
							<Button
								label="Confirm Finalization"
								isLoading={finalizeButtonLoading}
								onClick={() => finalize()}
							/>
						</div>
					</div>
				</section>
			</ModalNew>
		</>
	);
};
