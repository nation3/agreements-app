import { Button } from "@nation3/ui-components";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAgreementDispute, useAgreementFinalize } from "../../../hooks";
import { Modal, ModalProps } from "flowbite-react";
import { useTranslation } from "react-i18next";
import disputeIcon from "../../../public/svgs/dispute-icon.svg";
import finalizeIcon from "../../../public/svgs/finalize-icon.svg";
import { utils, BigNumber } from "ethers";
import Image from "next/image";
import { useAgreementData } from "../context/AgreementDataContext";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface ContextModalProps extends Pick<ModalProps, "show" | "onClose"> {
	icon: ReactNode;
	title: string;
	content: ReactNode;
	button: ReactNode;
}

const ContextModal = ({ icon, title, content, show, button, onClose }: ContextModalProps) => {
	return (
		<Modal show={show} onClose={onClose}>
			<Modal.Header>
				<div className="flex items-center w-full">
					<div className="overflow-hidden w-10 p-2 mr-2">{icon && icon}</div>
					<h3 className="text-slate-600 text-xl md:text-xl font-semibold">{title}</h3>
				</div>
			</Modal.Header>
			<div className="flex flex-col items-center justify-center gap-10 p-5 border-t-2 border-bluesky-200 text-gray-400">
				{content}
				{button}
			</div>
		</Modal>
	);
};

const ContextSection = ({
	title,
	highlight,
	content,
}: {
	title: ReactNode;
	highlight?: ReactNode;
	content?: ReactNode;
}) => {
	return (
		<div>
			<h3 className="text-lg font-medium text-slate-600 mb-2">{title}</h3>
			{highlight && <div className="font-medium text-md text-bluesky">{highlight}</div>}
			{content && <div>{content}</div>}
		</div>
	);
};

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
			<div className="grid grid-cols-2 gap-6">
				{/* FINALISE ACTION BLOCK */}
				<div className="w-full flex-col items-stretch h-full flex justify-between">
					<div className="flex flex-col justify-between">
						<div className="flex mb-4 items-center">
							<span>
								<CheckCircleIcon className="w-7 h-7 text-bluesky" />
							</span>
							<h3 className="text-xl text-slate-700 ml-2 font-semibold">
								{t("agreementActions.finalizeHeadline")}
							</h3>
						</div>
						<p className="text-slate-500 text-sm mb-4">
							{t("agreementActions.finalizeDescription")}
							<b className="text-slate-600">{t("agreementActions.finalizeDescriptionBold")}</b>.
						</p>
					</div>
					<Button
						outlined
						label={t("agreementActions.finalizeCTA")}
						onClick={() => setFinalizeModalVisibility(true)}
					/>
				</div>

				{/* DISPUTE ACTION BLOCK */}
				<div className="w-full flex-col h-full flex justify-between">
					<div className="flex flex-col justify-between h-full">
						<div className="flex mb-4 items-center">
							<span>
								<ExclamationCircleIcon className="w-7 h-7 text-bluesky" />
							</span>
							<h3 className="text-xl text-slate-700 ml-2 font-semibold">
								{t("agreementActions.disputeHeadline")}
							</h3>
						</div>
						<p className="text-slate-500 text-sm mb-4">
							{t("agreementActions.disputeDescription")}
						</p>
					</div>
					<Button
						disabled={userPosition?.status === 2}
						outlined
						label={t("agreementActions.disputeCTA")}
						onClick={() => setDisputeModalVisibility(true)}
					/>
				</div>
			</div>

			<ContextModal
				icon={
					<Image
						className="h-full"
						width={40}
						height={40}
						src={disputeIcon}
						alt={"Dispute Agreement"}
					/>
				}
				title={t("dispute.title")}
				content={
					<div className="px-12 pt-2 text-sm">
						<div className="md:max-w-[66%]">{t("dispute.description")}</div>
						<hr className="md:w-2/5 my-7" />
						<div className="flex flex-col gap-4">
							<ContextSection
								title={t("dispute.disputeCost.title")}
								highlight={`${utils.formatUnits(userPosition?.deposit ?? 0)} $NATION`}
								content={t("dispute.disputeCost.description")}
							/>
							<ContextSection
								title={t("dispute.evidenceSubmission.title")}
								highlight="5 days"
								content={t("dispute.evidenceSubmission.description")}
							/>
							<ContextSection
								title={t("dispute.disputeResolution.title")}
								content={t("dispute.disputeResolution.description")}
							/>
						</div>
					</div>
				}
				show={showDisputeModal}
				button={
					<Button
						label="Confirm Dispute"
						isLoading={disputeButtonLoading}
						onClick={() => dispute()}
					/>
				}
				onClose={() => setDisputeModalVisibility(false)}
			/>
			<ContextModal
				icon={
					<Image
						className="h-full"
						width={40}
						height={40}
						src={finalizeIcon}
						alt={"Finalize Agreement"}
					/>
				}
				title={t("finalize.title")}
				content={
					<div className="px-12 pt-2 text-sm">
						<div className="md:max-w-[66%]">{t("finalize.description")}</div>
						<hr className="md:w-2/5 my-7" />
						<div className="flex flex-col gap-4">
							<ContextSection
								title={t("finalize.tokenWithdrawal.title")}
								highlight={
									<>
										<div className="flex gap-2">
											<span>
												{utils.formatUnits(userPosition?.deposit ?? 0)} $
												{depositToken?.symbol ?? ""}
											</span>
											<span className="text-gray-400 font-medium">Dispute deposit</span>
										</div>
										<div className="flex gap-2">
											<span>
												{utils.formatUnits(BigNumber.from(userPosition?.balance))} $
												{collateralToken?.symbol ?? ""}
											</span>
											<span className="text-gray-400 font-medium">Collateral</span>
										</div>
									</>
								}
								content={t("finalize.tokenWithdrawal.description")}
							/>
						</div>
					</div>
				}
				show={showFinalizeModal}
				button={
					<Button
						label="Confirm Finalization"
						isLoading={finalizeButtonLoading}
						onClick={() => finalize()}
					/>
				}
				onClose={() => setFinalizeModalVisibility(false)}
			/>
		</>
	);
};
