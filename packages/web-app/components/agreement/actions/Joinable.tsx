import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { BigNumber, constants } from "ethers";
import { Button, Modal, Steps } from "@nation3/ui-components";

import { NotEnoughBalanceAlert } from "../../alerts";
import { useToken, useAgreementJoin } from "../../../hooks/useAgreement";
import { NATION } from "../../../lib/constants";
import { UserPosition } from "../context/types";

export const JoinableAgreementActions = ({
	id,
	userPosition,
}: {
	id: string;
	userPosition: UserPosition;
}) => {
	const [isJoinAgreementStarted, setisJoinAgreementStarted] = useState<boolean>(false);

	const { address } = useAccount();

	const {
		balance: accountTokenBalance,
		allowance: accountTokenAllowance,
		approve,
		approvalLoading,
		approvalProcessing,
	} = useToken({
		address: NATION,
		account: address || constants.AddressZero,
		enabled: typeof address !== "undefined",
	});

	const userResolver = useMemo(
		() => ({
			account: address || constants.AddressZero,
			balance: userPosition.resolver?.balance || "0",
			proof: userPosition.resolver?.proof || [],
		}),
		[address, userPosition],
	);

	const { join, isLoading: joinLoading, isProcessing: joinProcessing } = useAgreementJoin();

	const requiredBalance = useMemo((): BigNumber => {
		return BigNumber.from(userPosition.resolver?.balance || 0);
	}, [userPosition]);

	const enoughBalance = useMemo((): boolean => {
		if (accountTokenBalance) {
			return requiredBalance.lte(BigNumber.from(accountTokenBalance));
		} else {
			return true;
		}
	}, [accountTokenBalance, requiredBalance]);

	const enoughAllowance = useMemo(() => {
		if (accountTokenAllowance) {
			return requiredBalance.lte(BigNumber.from(accountTokenAllowance));
		} else {
			return true;
		}
	}, [accountTokenAllowance, requiredBalance]);

	const steps = [{}];

	return (
		<div className="flex flex-col gap-1">
			{!enoughAllowance ? (
				<Button
					label="Approve"
					disabled={approvalLoading || approvalProcessing}
					isLoading={approvalLoading || approvalProcessing}
					onClick={() => approve({ amount: requiredBalance })}
				/>
			) : (
				<Button
					label="Join"
					disabled={joinLoading || joinProcessing || !enoughBalance || !enoughAllowance}
					isLoading={joinLoading || joinProcessing}
					onClick={() => join({ id, resolver: userResolver })}
				/>
			)}
			{/* 
TODO: 
{
				<Modal open={isJoinAgreementStarted}>
					<Steps steps={steps} icon={""} title={""} stepIndex={0} loadingIndex={null} />
				</Modal>
			} */}
			{!enoughBalance && <NotEnoughBalanceAlert />}
		</div>
	);
};
