import { Button } from "@nation3/ui-components";
import { useAgreementDispute, useAgreementFinalize } from "../../../hooks";

export const JoinedAgreementActions = ({ id }: { id: string }) => {
	const { dispute } = useAgreementDispute({ id });
	const { finalize } = useAgreementFinalize({ id });

	return (
		<div className="flex gap-2 justify-between">
			<Button label="Dispute" bgColor="red" onClick={() => dispute()} />
			<Button label="Finalize" bgColor="greensea" onClick={() => finalize()} />
		</div>
	);
};
