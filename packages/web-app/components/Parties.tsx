import { PositionMap, Token } from "./agreement/context/types";
import { PositionStatusBadge } from ".";
import { Table, useScreen, ScreenType } from "@nation3/ui-components";
import { utils, BigNumber } from "ethers";
import { AccountDisplay } from "./AccountDisplay";
import cx from "classnames";
import { BodyHeadline } from "@nation3/ui-components";
import React from "react";

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
	0: { message: "Pending join", color: "pr-c-blue1" },
	1: { message: "Joined", color: "pr-c-green1" },
	2: { message: "Finalized", color: "greensea" },
	3: { message: "Withdrawn", color: "gray" },
	4: { message: "Disputed", color: "red" },
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
	const filteredPositions = buildPositions(positions);

	return (
		<>
			{filteredPositions.map(({ message, color, positions }) => (
				<>
					<BodyHeadline>
						{message} ({positions.length})
					</BodyHeadline>
					<div key={message} className={cx("mb-base p-base w-full rounded-md", "bg-" + color)}>
						<div className="grid grid-cols-5 gap-16">
							<div className="col-start-1 col-end-4">
								<p className="text-neutral-c-500">Address</p>
							</div>
							<div className="col-start-4 col-end-4">
								<p className="text-neutral-c-500">Collateral</p>
							</div>
							<div className="col-start-5 col-end-5">
								<p className="text-neutral-c-500">Token</p>
							</div>
						</div>
						{positions.map(({ account, balance, status }) => (
							<section key={account} className="grid grid-cols-5 gap-16">
								<div className="col-start-1 col-end-4">
									<AccountDisplay address={account} />
								</div>
								<div className="col-start-4 col-end-4">
									<b>{utils.formatUnits(BigNumber.from(balance))}</b>
								</div>
								<div className="col-start-5 col-end-5">
									<span>{token?.symbol ?? ""}</span>
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
