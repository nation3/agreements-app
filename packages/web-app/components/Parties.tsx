import { PositionMap, Token } from "./agreement/context/types";
import { PositionStatusBadge } from ".";
import { Table, useScreen, ScreenType, Body2, Body3, UserIcon } from "@nation3/ui-components";
import { utils, BigNumber } from "ethers";
import { AccountDisplay } from "./AccountDisplay";
import cx from "classnames";
import { BodyHeadline } from "@nation3/ui-components";
import React from "react";
import { useAccount } from "wagmi";

interface Position {
	account: string;
	balance: string;
	status: number;
}

interface FilteredPositions {
	message: string;
	color: string;
	positions: Position[];
}

const statusBadgeMap: { [key: number]: { message: string; color: string } } = {
	0: { message: "Pending", color: "pr-c-blue1" },
	1: { message: "Joined", color: "pr-c-green1" },
	2: { message: "Finalized", color: "neutral-c-200" },
	3: { message: "Withdrawn", color: "neutral-c-200" },
	4: { message: "Disputed", color: "neutral-c-200" },
};

const buildPositions = (positions: PositionMap | undefined): FilteredPositions[] => {
	const result: FilteredPositions[] = [];

	Object.entries(positions ?? {}).forEach(([account, { balance, status }]) => {
		if (status !== undefined) {
			const index = result.findIndex(({ message }) => message === statusBadgeMap[status].message);
			if (index === -1) {
				result.push({
					message: statusBadgeMap[status].message,
					color: statusBadgeMap[status].color,
					positions: [{ account, balance, status }],
				});
			} else {
				result[index].positions.push({ account, balance, status });
			}
		}
	});

	return result;
};

const Parties = ({
	positions,
	token,
}: {
	positions: PositionMap | undefined;
	token: Token | undefined;
}) => {
	const { screen } = useScreen();
	const { address: myAccount } = useAccount();
	const filteredPositions = buildPositions(positions);

	return (
		<>
			{filteredPositions.map(({ message, color, positions }) => (
				<>
					<BodyHeadline className="mb-min3">
						{message} ({positions.length})
					</BodyHeadline>
					<div key={message} className={cx("mb-base p-min3 w-full rounded-md", "bg-" + color)}>
						{positions.map(({ account, balance, status }) => (
							<section key={account} className="grid grid-cols-5 md:gap-16 gap-8">
								<div className="col-start-1 col-end-6 md:col-end-4 flex">
									<div>
										<Body3 className="text-neutral-c-500 mb-min2">Address</Body3>
										<div className="flex">
											<AccountDisplay address={account} />
											{myAccount === account && (
												<div className="flex rounded ml-min3">
													<UserIcon className="h-base" />
													<Body2 className="ml-min2">You</Body2>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="col-start-1 col-end-3 md:col-start-4 md:col-end-4">
									<Body3 className="text-neutral-c-500 mb-min2">Collateral</Body3>
									<Body3>{utils.formatUnits(BigNumber.from(balance))}</Body3>
								</div>
								<div className="col-start-4 col-end-6 md:col-start-5 md:col-end-5">
									<Body3 className="text-neutral-c-500 mb-min2">Token</Body3>
									<Body3>{token?.symbol ?? ""}</Body3>
								</div>
							</section>
						))}
					</div>
				</>
			))}
		</>
	);
};

export default Parties;
