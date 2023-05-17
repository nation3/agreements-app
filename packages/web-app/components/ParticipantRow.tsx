import {
	AddressInput,
	Body1,
	Button,
	IconRenderer,
	N3Cross,
	N3User,
	TokenBalanceInput,
	Body3,
} from "@nation3/ui-components";
import { BigNumber, ethers, providers, utils } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import { purgeFloat } from "../utils";
import { InputPositionList } from "./agreementCreate/context/types";

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
	const [isEnsName, setIsEnsName] = useState(false);
	const [localPositions, setlocalPositions] = useState<InputPositionList>(positions);

	useEffect(() => {
		positions && setlocalPositions(positions);
	}, [positions]);

	const updatePositionAccount = (address: string, input: string) => {
		const isEns = ethers.utils.isAddress(input) ? false : true;
		setIsEnsName(isEns);
		const newPositions = positions.map((position, i) => {
			if (i === index) {
				return { ...position, account: address };
			}
			return position;
		});
		onChange?.(newPositions);
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
				className="flex flex-col w-full gap-min3 rounded-md bg-neutral-c-200 p-min3 relative border-2 border-neutral-c-300"
				initial={{ opacity: 0, y: -7 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -7 }}
				transition={{ duration: 0.2, delay: index * 0.05 }}
			>
				{removePosition && (
					<div
						className="absolute md:top-min3 md:right-min3 top-min2 right-min2"
						onClick={() => removePosition()}
					>
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
					<Body1 className="w-full text-neutral-c-800">Participant {index + 1}</Body1>
				</div>
				<div className="grid grid-cols-5 gap-min2">
					<div className="col-start-1 col-end-6 lg:col-end-4">
						<AddressInput
							label="Address"
							defaultValue={localPositions[index].account}
							focusColor="pr-c-blue2"
							placeholder={"Ens handler or address"}
							ensProvider={ensProvider}
							showEnsName={isEnsName}
							onBlurCustom={(e: ChangeEvent<HTMLInputElement>) => {
								updatePositionAccount(e.target.value, e.target.value);
							}}
						/>
					</div>
					<div className="col-start-1 col-end-4 lg:col-start-4 lg:col-end-5">
						<TokenBalanceInput
							label="Collateral"
							defaultValue={utils.formatUnits(localPositions[index].balance)}
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
					<div className="col-start-4 col-end-6 lg:col-start-5 lg:col-end-6">
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
