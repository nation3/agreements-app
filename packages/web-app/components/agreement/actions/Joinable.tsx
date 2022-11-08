import { useMemo } from "react";
import { useAccount } from "wagmi";
import { BigNumber, constants } from "ethers";
import { Button } from "@nation3/ui-components";

import { NotEnoughBalanceAlert, NotEnoughAllowanceAlert } from "../../alerts";
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
	const { address } = useAccount();

	const {
		balance: accountTokenBalance,
		allowance: accountTokenAllowance,
		// approve,
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

	const enoughBalance = useMemo(() => {
		if (accountTokenBalance) {
			return (
				BigNumber.from(userPosition.resolver?.balance || 0) < BigNumber.from(accountTokenBalance)
			);
		} else {
			return true;
		}
	}, [accountTokenBalance, userPosition]);

	const enoughAllowance = useMemo(() => {
		if (accountTokenAllowance) {
			return (
				BigNumber.from(userPosition.resolver?.balance || 0) < BigNumber.from(accountTokenAllowance)
			);
		} else {
			return true;
		}
	}, [accountTokenAllowance, userPosition]);

	return (
		<div className="flex flex-col gap-1">
				<Button
					label="Join"
					disabled={joinLoading || joinProcessing || !enoughBalance || !enoughAllowance}
					isLoading={joinLoading || joinProcessing}
					onClick={() => join({ id, resolver: userResolver })}
				/>
			{!enoughBalance && <NotEnoughBalanceAlert />}
			{!enoughAllowance && <NotEnoughAllowanceAlert />}
		</div>
	);
};
