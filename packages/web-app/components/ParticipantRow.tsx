import { useState, ChangeEvent, FocusEvent } from "react";
import { utils } from "ethers";
import { TextInput, TokenBalanceInput } from "@nation3/ui-components";

// TODO:
// - Better way of updating array?

const purgeFloat = (number: string, config?: { units?: number; strip?: boolean }) => {
	const maxDecimals = config?.units ?? 18;
	const purged = number
		.replace(/[^0-9,.]/g, "")
		.replace(/,/g, ".")
		.replace(new RegExp(`^(\\d*(\\.\\d{0,${maxDecimals}})?)\\d*$`, "g"), "$1");

	return config?.strip ? purged.replace(/\.$/g, "") : purged;
};

type Position = { account: string; balance: number };

export const ParticipantRow = ({
	positions,
	index,
	onChange,
}: {
	positions: Position[];
	index: number;
	onChange?: (poistions: Position[]) => void;
}) => {
	const [value, setValue] = useState(utils.formatUnits(positions[index].balance));

	const updatePositionAccount = (account: string) => {
		const positions_ = JSON.parse(JSON.stringify(positions));
		positions_[index].account = account;
		onChange?.(positions_);
	};

	const updatePositionBalance = (balance: string) => {
		const positions_ = JSON.parse(JSON.stringify(positions));
		positions_[index].balance = utils.parseUnits(balance || "0");
		onChange?.(positions_);
	};

	return (
		<div className="flex gap-2 justify-between space-x-2">
			<div className="flex-1 basis-1/2">
				<TextInput
					value={positions[index].account}
					placeholder="vitalik.eth"
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						updatePositionAccount(e.target.value);
					}}
				/>
			</div>
			<div className="basis-2/5">
				<TokenBalanceInput
					value={value}
					token={"NATION"}
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						const purged = purgeFloat(e.target.value);
						if (parseFloat(purged) < 0) return;
						setValue(purged);
					}}
					onBlur={(e: FocusEvent<HTMLInputElement>) => {
						updatePositionBalance(purgeFloat(e.target.value, { strip: true }));
					}}
				/>
			</div>
		</div>
	);
};
