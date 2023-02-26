import { ChangeEvent, FocusEvent } from "react";
import { utils, BigNumber, providers } from "ethers";
import { AddressInput, TokenBalanceInput } from "@nation3/ui-components";

import { purgeFloat } from "../utils";

// TODO:
// - Better way of updating array?

type Position = { account: string; balance: BigNumber };

export const ParticipantRow = ({
	positions,
	index,
	token,
	onChange,
	ensProvider,
}: {
	positions: Position[];
	token: string;
	index: number;
	onChange?: (positions: Position[]) => void;
	ensProvider?: providers.BaseProvider;
}) => {
	const updatePositionAccount = (account: string) => {
		// Deep copy of the array
		const positions_ = positions.map((position) => ({ ...position }));
		positions_[index].account = account;
		onChange?.(positions_);
	};

	const updatePositionBalance = (balance: string) => {
		// Deep copy of the array
		const positions_ = positions.map((position) => ({ ...position }));
		positions_[index].balance = utils.parseUnits(balance || "0");
		onChange?.(positions_);
	};

	return (
		<div className="flex grow gap-2">
			<div className="basis-3/5">
				<AddressInput
					defaultValue={positions[index].account}
					placeholder="vitalik.eth"
					ensProvider={ensProvider}
					onBlur={(e: ChangeEvent<HTMLInputElement>) => {
						updatePositionAccount(e.target.value);
					}}
				/>
			</div>
			<div className="basis-2/5">
				<TokenBalanceInput
					defaultValue={utils.formatUnits(positions[index].balance)}
					token={token}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						const purged = purgeFloat(e.target.value);
						if (parseFloat(purged) < 0) return;
						e.target.value = purged;
					}}
					onBlur={(e: FocusEvent<HTMLInputElement>) => {
						if (!e.target.value) {
							e.target.value = e.target.placeholder;
						}
						updatePositionBalance(purgeFloat(e.target.value, { strip: true }));
					}}
				/>
			</div>
		</div>
	);
};
