import {
	AddressInput,
	Body1,
	Button,
	IconRenderer,
	N3Cross,
	N3User,
	TokenBalanceInput,
} from "@nation3/ui-components";
import { BigNumber, providers, utils } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChangeEvent, FocusEvent } from "react";
import { Body3 } from "../../ui-components/src/components/Atoms";
import { purgeFloat } from "../utils";

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
	token: any;
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
		<AnimatePresence>
			<motion.div
				className="flex flex-col w-full gap-min3 rounded-md bg-neutral-c-200 p-min3 relative"
				initial={{ opacity: 0, y: -7 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -7 }}
				transition={{ duration: 0.2, delay: index * 0.05 }}
			>
				{removePosition && (
					<div className="absolute top-min3 right-min3" onClick={() => removePosition()}>
						<Button
							size="small"
							label="Delete"
							className="shadow-sm hover:shadow"
							iconLeft={<N3Cross className="w-min3 h-min3" />}
							disabled={positions.length <= 2}
						/>
					</div>
				)}
				<div className="gap-min3 flex items-center w-full">
					<IconRenderer icon={<N3User />} backgroundColor={"pr-c-green1"} size={"xs"} />
					<Body1 className="w-full text-neutral-c-800">Participant {index}</Body1>
				</div>
				<div className="flex flex-grow gap-min2">
					<div className="grow">
						<AddressInput
							label="Address"
							defaultValue={positions[index].account}
							focusColor="pr-c-blue2"
							placeholder="vitalik.eth"
							ensProvider={ensProvider}
							onBlur={(e: ChangeEvent<HTMLInputElement>) => {
								updatePositionAccount(e.target.value);
							}}
						/>
					</div>
					<div className="basis-36">
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
					<div className="basis-36">
						<Body3 color="neutral-c-600">Token</Body3>
						<div className="gap-min2 flex items-center border-neutral-c-300 bg-white px-min3 h-double border-2 rounded-base min-w-0 w-full text-sm border-gray-300">
							{/* {token?.icon && (
							<IconRenderer icon={token?.icon} backgroundColor={"neutral-c-200"} size={"xs"} />
						)} */}
							{token?.icon && <Image height={20} width={20} alt={token.name} src={token?.icon} />}

							<Body3>
								{"$"}
								{token?.symbol}
							</Body3>
						</div>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};
