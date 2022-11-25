import { ChangeEvent, FocusEvent } from "react";
import { utils, BigNumber } from "ethers";
import { AddressInput, IconButton, TokenBalanceInput } from "@nation3/ui-components";
import { PlusIcon } from "@heroicons/react/24/outline";
import { MinusIcon } from "@heroicons/react/24/solid";
import { purgeFloat } from "../utils";

// TODO:
// - Better way of updating array?

type Position = { account: string; balance: BigNumber };

export const ParticipantRow = ({
	positions,
	index,
	onChange,
}: {
	positions: Position[];
	index: number;
	onChange?: (poistions: Position[]) => void;
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
		<div className="flex gap-2">
			<div className="basis-1/2">
				<AddressInput
					value={positions[index].account}
					placeholder="vitalik.eth"
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						updatePositionAccount(e.target.value);
					}}
				/>
			</div>
			<div className="basis-2/5">
				<TokenBalanceInput
					defaultValue={utils.formatUnits(positions[index].balance)}
					token={"NATION"}
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
			<div className="basis-1/12 flex items-center space-x-1">
				<IconButton
					icon={<PlusIcon className="w-5 h-5" />}
					onClick={() =>
						onChange?.([...positions, { account: "", balance: utils.parseUnits("0") }])
					}
				/>
				<IconButton
					icon={<MinusIcon className="w-5 h-5" />}
					disabled={positions.length <= 2}
					onClick={() => onChange?.(positions.filter((_, i) => i !== index))}
				/>
			</div>
		</div>
	);
};
