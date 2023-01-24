import { Button } from "@nation3/ui-components";
import { useEffect } from "react";
import { useAgreementDispute, useAgreementFinalize } from "../../../hooks";

export const JoinedAgreementActions = ({ id }: { id: string }) => {
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

	return (
		<div className="flex gap-2 items-center justify-between">
			<Button
				label="Dispute"
				bgColor="red"
				isLoading={disputeLoading || disputeProcessing}
				disabled={disputeLoading || disputeProcessing}
				onClick={() => dispute()}
			/>
			<Button
				label="Finalize"
				bgColor="greensea"
				isLoading={finalizationLoading || finalizationProcessing}
				disabled={finalizationLoading || finalizationProcessing}
				onClick={() => finalize()}
			/>
		</div>
	);
};
