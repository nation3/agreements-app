import { Body2, Body3, UserIcon, useScreen } from "@nation3/ui-components";
import cx from "classnames";
import { BigNumber, utils } from "ethers";
import { useAccount } from "wagmi";
import { AccountDisplay } from "./AccountDisplay";
import { Token } from "./agreement/context/types";
import { AgreementPosition } from "../lib/types";

interface Position {
	account: string;
	balance: string;
	status: string;
}

interface FilteredPositions {
	message: string;
	color: string;
	positions: Position[];
}

const statusBadgeMap: { [key: string]: { message: string; color: string } } = {
	Pending: { message: "Pending", color: "neutral-c-200" },
	Joined: { message: "Joined", color: "pr-c-green1" },
	Finalized: { message: "Finalized", color: "neutral-c-200" },
	Withdrawn: { message: "Withdrawn", color: "neutral-c-200" },
	Disputed: { message: "Disputed", color: "neutral-c-200" },
};

export const buildParties = (positions: AgreementPosition[] | undefined): FilteredPositions[] => {
	const result: FilteredPositions[] = [];

	positions?.forEach(({ party, collateral, status }) => {
		if (status !== undefined) {
			const index = result.findIndex(({ message }) => message === statusBadgeMap[status].message);
			if (index === -1) {
				result.push({
					message: statusBadgeMap[status].message,
					color: statusBadgeMap[status].color,
					positions: [{ account: party, balance: collateral, status }],
				});
			} else {
				result[index].positions.push({ account: party, balance: collateral, status });
			}
		}
	});

	return result;
};

const Parties = ({
	positions,
	token,
}: {
	positions: AgreementPosition[] | undefined;
	token: Token | undefined;
}) => {
	const { screen } = useScreen();
	const { address: myAccount } = useAccount();
	const filteredPositions = buildParties(positions);

	return (
		<section>
			{filteredPositions.map(({ message, color, positions }) => (
				<>
					<Body3 color="neutral-c-600" className="mt-min3 mb-min2 ml-min2">
						{message} ({positions.length})
					</Body3>
					<div>
						{positions.map(({ account, balance, status }, i) => (
							<div
								key={i}
								className={cx("mb-min2 last:mb-0 p-min3 w-full rounded-md", "bg-" + color)}
							>
								<section key={account} className="grid grid-cols-5 md:gap-16 gap-8">
									<div className="col-start-1 col-end-6 md:col-end-4 flex">
										<div>
											<Body3 color="neutral-c-500" className="mb-min2">
												Address
											</Body3>
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
									<div className="col-start-1 col-end-3 md:col-start-4 md:col-end-4 flex justify-end flex-col">
										<Body3 color="neutral-c-500" className="mb-min2">
											Collateral
										</Body3>
										<Body3>{utils.formatUnits(BigNumber.from(balance))}</Body3>
									</div>
									<div className="col-start-4 col-end-6 md:col-start-5 md:col-end-5 flex justify-end flex-col">
										<Body3 color="neutral-c-500" className="mb-min2">
											Token
										</Body3>
										<Body3>{token?.symbol ?? ""}</Body3>
									</div>
								</section>
							</div>
						))}
					</div>
				</>
			))}
		</section>
	);
};

export default Parties;
