import { BigNumber } from "ethers";
import { Button } from "@nation3/ui-components";

import { useAgreementWithdraw } from "../../../hooks";
import { UserPosition } from "../context/types";

export const FinalizedAgreementActions = ({
	id,
	userPosition,
}: {
	id: string;
	userPosition: UserPosition;
}) => {
	const {
		withdraw,
		isLoading: withdrawLoading,
		isProcessing: withdrawProcessing,
	} = useAgreementWithdraw({ id });

	if (BigNumber.from(userPosition.balance).gt(0))
		return (
			<Button
				label="Withdraw"
				disabled={withdrawLoading || withdrawProcessing}
				isLoading={withdrawLoading || withdrawProcessing}
				onClick={() => withdraw()}
			/>
		);

	return <></>;
};
