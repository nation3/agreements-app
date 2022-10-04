import { useEffect, useState } from "react";
import { utils } from "ethers";
import { TextInput, TokenBalanceInput } from "@nation3/ui-components";

// TODO:
// - Better way of updating array?
// - Better way of updating component on changes in the array

const purgeFloat = (number: string, config?: { units?: number; strip?: boolean }) => {
	const maxDecimals = config?.units ?? 18;
	const purged = number
		.replace(/[^0-9,.]/g, "")
		.replace(/,/g, ".")
		.replace(new RegExp(`^(\\d*(\\.\\d{0,${maxDecimals}})?)\\d*$`, "g"), "$1");

	return config?.strip ? purged.replace(/\.$/g, "") : purged;
};

export const ParticipantRow = ({
	positions,
	index,
	onChange,
}: {
	positions: any[];
	index: number;
	onChange?: (e?: any) => void;
}) => {
	const [value, setValue] = useState(utils.formatUnits(positions[index].balance));

	useEffect(() => {}, [positions]);

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
		<div className="flex gap-2">
			<div className="basis-1/2">
				<TextInput
					value={positions[index].account}
					placeholder="vitalik.eth"
					onChange={(e: any) => {
						updatePositionAccount(e.target.value);
					}}
				/>
			</div>
			<div className="basis-2/5">
				<TokenBalanceInput
					value={value}
					token={"NATION"}
					onChange={(e: any) => {
						const purged = purgeFloat(e.target.value);
						if (parseFloat(purged) < 0) return;
						setValue(purged);
					}}
					onBlur={(e: any) => {
						updatePositionBalance(purgeFloat(e.target.value, { strip: true }));
					}}
				/>
			</div>
		</div>
	);
};
