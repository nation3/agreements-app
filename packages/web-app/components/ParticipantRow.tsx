import { AddressInput, TokenBalanceInput } from "@nation3/ui-components";
import { BigNumber, providers, utils } from "ethers";
import { ChangeEvent, FocusEvent } from "react";

import { Body1, Button, N3Cross, UserIcon } from "@nation3/ui-components";
import { Body3 } from "../../ui-components/src/components/Atoms";
import { purgeFloat } from "../utils";

// TODO:
// - Better way of updating array?

type Position = { account: string; balance: BigNumber };

export const ParticipantRow = ({
	positions,
	index,
	token,
	onChange,
	removePosition,
	ensProvider,
}: {
	positions: Position[];
	token: string;
	index: number;
	removePosition?: any;
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
		<div className="flex flex-col w-full gap-min3 rounded-md bg-pr-c-blue1 p-min3 relative">
			{removePosition && (
				<div className="absolute top-min2 right-min2" onClick={() => removePosition()}>
					<Button
						size="small"
						label="Delete"
						className="shadow"
						iconLeft={<N3Cross className="w-base h-base" />}
						disabled={positions.length <= 2}
					/>
				</div>
			)}
			<div className="gap-base flex w-full">
				<UserIcon className="h-base" />
				<Body1 className="w-full text-neutral-c-800">Participant {index}</Body1>
			</div>
			<div className="flex grow gap-min3">
				<div className="w-full">
					<AddressInput
						label="Address"
						defaultValue={positions[index].account}
						placeholder="vitalik.eth"
						ensProvider={ensProvider}
						onBlur={(e: ChangeEvent<HTMLInputElement>) => {
							updatePositionAccount(e.target.value);
						}}
					/>
				</div>
				<div className="basis-[130px]">
					<TokenBalanceInput
						label="Collateral"
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
				<div>
					<Body3>Token</Body3>
					<div className="`border-neutral-c-300 bg-white p-min2 border-2 rounded-base basis-[130px]">
						{token}
					</div>
				</div>
			</div>
		</div>
	);
};
