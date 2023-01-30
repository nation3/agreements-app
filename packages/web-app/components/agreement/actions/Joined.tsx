import { Button } from "@nation3/ui-components";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAgreementDispute, useAgreementFinalize } from "../../../hooks";
import { Modal, ModalProps } from "flowbite-react";
import { useTranslation } from "react-i18next";

interface ContextModalProps extends Pick<ModalProps, "show" | "onClose"> {
	title: string;
	context: string;
	button: ReactNode;
}

const ContextModal = ({ title, context, show, button, onClose }: ContextModalProps) => {
	return (
		<Modal show={show} onClose={onClose}>
			<Modal.Header>
				<div className="flex items-center w-full pl-3">
					<h3 className="text-slate-600 text-xl md:text-xl font-semibold">{title}</h3>
				</div>
			</Modal.Header>
			<div className="flex flex-col items-center justify-center gap-5 p-8 border-t-2 border-bluesky-200">
				<div className="text-slate-600">{context}</div>
				{button}
			</div>
		</Modal>
	);
};

export const JoinedAgreementActions = ({ id }: { id: string }) => {
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
			<div className="flex gap-2 items-center justify-between">
				<Button label="Dispute" onClick={() => setDisputeModalVisibility(true)} />
				<Button label="Finalize" onClick={() => setFinalizeModalVisibility(true)} />
			</div>
			<ContextModal
				title={t("dispute.title")}
				context={t("dispute.description")}
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
				title={t("finalize.title")}
				context={t("finalize.description")}
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
