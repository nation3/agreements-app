import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import { utils, BigNumber } from "ethers";
import { AddressInput, TokenBalanceInput } from "@nation3/ui-components";
import { useEnsAddress } from "wagmi";
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
	onChange?: (positions: Position[]) => void;
}) => {
	const [addressInput, setAddressInput] = useState<string>("");
	const { data: ensAddress } = useEnsAddress({ name: addressInput, chainId: 1 });

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

	// use resolved ENS address if valid
	useEffect(() => {
		console.log("ensAddress: ", ensAddress);
		ensAddress ? updatePositionAccount(ensAddress) : updatePositionAccount(addressInput);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ensAddress, addressInput]);

	return (
		<div className="flex grow gap-2">
			<div className="basis-3/5">
				<AddressInput
					value={positions[index].account}
					placeholder="vitalik.eth"
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setAddressInput(e.target.value);
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
		</div>
	);
};
