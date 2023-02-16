import { utils } from "ethers";
import { Position, useDispute } from "./context/DisputeResolutionContext";
import { Accordion } from "flowbite-react";
import { useCohort } from "../../hooks/useCohort";
import { CountDown } from "../../components/CountDown";
import {
	ActionBadge,
	Button,
	Table,
	utils as n3utils,
} from "@nation3/ui-components";
import { useMemo } from "react";
import { AccountDisplay } from "../AccountDisplay";
import { CardHeader } from "../CardHeader";

const SettlementTable = ({ token, positions }: { token: string; positions: Position[] }) => {
	return (
		<Table
			columns={["participant", "stake"]}
			data={positions.map(({ party, balance }, index) => [
				<AccountDisplay key={index} address={party} />,
				<b key={index}> {utils.formatUnits(balance)} ${token}</b>,
			])}
		/>
	);
};

const ResolutionDataDisplay = ({
	mark,
	status,
	token,
	settlement,
	unlockTime,
}: {
	mark?: string;
	status: string;
	token: string;
	settlement: Position[];
	unlockTime?: number;
}) => {
	const timeLeft = useMemo(() => {
		const now = Math.floor(Date.now() / 1000);

		if (unlockTime && unlockTime > now) {
			return unlockTime - now;
		} else {
			return 0;
		}
	}, [unlockTime]);

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-3">
				<CardHeader title={"Resolution"} status={status} size={"xl"} />
				<div className="flex flex-col md:flex-row gap-1">
					{mark && <ActionBadge label="Fingerprint" data={n3utils.shortenHash(mark)} />}
					{status == "Approved" && unlockTime && (
						<ActionBadge label="Appeal time left" data={<CountDown seconds={timeLeft} />} />
					)}
				</div>
			</div>
			{settlement && <SettlementTable token={token} positions={settlement} />}
		</div>
	);
};

export const ResolutionDetails = () => {
	const { dispute, resolution } = useDispute();

	if (resolution) {
		return (
			<ResolutionDataDisplay
				mark={resolution.id}
				status={resolution.status}
				token={dispute.collateralToken?.symbol ?? ""}
				settlement={resolution.settlement ?? []}
				unlockTime={resolution.unlockTime}
			/>
		);
	} else {
		return <></>;
	}
};

export const ProposedResolutionDetails = () => {
	const { dispute, proposedResolutions } = useDispute();
	const { approve, reject } = useCohort();

	if (proposedResolutions) {
		return (
			<div className="flex flex-col gap-2">
				<div>
					<div className="text-md font-display">Proposed settlements</div>
					<div className="border-2 rounded-xl"></div>
				</div>
				<Accordion alwaysOpen={true}>
					{proposedResolutions.map(
						({ txHash, txNonce, confirmationsRequired, confirmations, resolution }, i) => {
							return (
								<Accordion.Panel key={i}>
									<Accordion.Title>
										#{txNonce} Settlement proposed by{" "}
										<AccountDisplay address={confirmations[0].owner} /> |{" "}
										{confirmations.length}/{confirmationsRequired} approvals
									</Accordion.Title>
									<Accordion.Content>
										<div className="flex flex-col gap-8">
											<ResolutionDataDisplay
												status="Proposed"
												token={dispute.collateralToken?.symbol ?? ""}
												settlement={resolution.settlement ?? []}
											/>
											{confirmationsRequired > confirmations.length && (
												<div className="flex flex-col md:flex-row gap-2">
													<Button
														label="Reject"
														bgColor="red"
														onClick={async () => {
															await reject(txNonce);
															window.location.reload();
														}}
													/>
													<Button
														label="Approve"
														bgColor="greensea"
														onClick={async () => {
															await approve(txHash);
															window.location.reload();
														}}
													/>
												</div>
											)}
										</div>
									</Accordion.Content>
								</Accordion.Panel>
							);
						},
					)}
				</Accordion>
			</div>
		);
	} else {
		return <></>;
	}
};
