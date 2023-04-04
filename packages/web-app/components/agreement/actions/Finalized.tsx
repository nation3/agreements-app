// import { BigNumber } from "ethers";
import { Button } from "@nation3/ui-components";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import { useAgreementWithdraw } from "../../../hooks";
import { UserPosition } from "../context/types";
import { useEffect } from "react";

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

	if (userPosition.status == 2)
		return (
			<div className="grid grid-cols-1 gap-6">
				<div className="w-full flex-col items-stretch h-full flex justify-between">
					<div className="flex flex-col justify-between">
						<div className="flex mb-4 items-center">
							<span>
								<CheckCircleIcon className="w-7 h-7 text-bluesky" />
							</span>
							<h3 className="text-xl text-slate-700 ml-2 font-semibold">Withdraw from agreement</h3>
						</div>
						<p className="text-slate-500 text-sm mb-4">
							Withdraw you locked funds from this agreement.
						</p>
					</div>
					<div className="flex w-auto">
						<Button
							className="flex w-auto min-w-[60%] px-10 rounded-full"
							outlined
							disabled={withdrawLoading || withdrawProcessing}
							isLoading={withdrawLoading || withdrawProcessing}
							label="Withdraw"
							onClick={() => withdraw()}
						/>
					</div>
				</div>
			</div>
		);

	return <></>;
};
