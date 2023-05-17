// import { BigNumber } from "ethers";
import { Body3, BodyHeadline, Button } from "@nation3/ui-components";

import { useEffect } from "react";
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
		isTxSuccess: isWithdrawSuccess,
	} = useAgreementWithdraw({ id });

	useEffect(() => {
		if (isWithdrawSuccess) window.location.reload();
	}, [isWithdrawSuccess]);

	return (
		<section className="grid grid-cols-1 gap-min3">
			<div className="w-full flex-col items-stretch h-full flex justify-between gap-min3">
				<div className="flex flex-col justify-between gap-min3">
					<div className="flex items-center mr-min3">
						<BodyHeadline color="neutral-c-800">Withdraw from agreement</BodyHeadline>
					</div>
					<Body3 color="neutral-c-500" className="text-sm ">
						Withdraw you locked funds from this agreement.
					</Body3>
				</div>
				<Button
					outlined
					disabled={withdrawLoading || withdrawProcessing}
					isLoading={withdrawLoading || withdrawProcessing}
					label="Withdraw"
					onClick={() => withdraw()}
				/>
			</div>
		</section>
	);
};
