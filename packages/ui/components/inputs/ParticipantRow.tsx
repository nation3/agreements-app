import { useEffect } from "react";
import TextInput from "./TextInput.tsx";
import TokenBalanceInput from "./TokenBalanceInput";

// TODO:
// - Better way of updating array?

const ParticipantRow = ({
	positions,
	index,
	onChange,
}: {
	positions: any[];
	index: number;
	onChange?: () => void;
}) => {
	useEffect(() => {}, [positions]);

	return (
		<div className="flex gap-2">
			<TextInput
				value={positions[index].address}
				placeholder="vitalik.eth"
				onChange={(e: any) => {
					const positions_ = JSON.parse(JSON.stringify(positions));
					positions_[index].address = e.target.value;
					onChange(positions_);
				}}
			/>
			<TokenBalanceInput
				value={positions[index].balance}
				token={"NATION"}
				onChange={(e: any) => {
					if (e.target.value < 0) {
						return false;
					}
					const positions_ = JSON.parse(JSON.stringify(positions));
					positions_[index].balance = e.target.value;
					console.log(positions_[index].balance.toString());
					onChange(positions_);
				}}
			/>
		</div>
	);
};

export default ParticipantRow;
