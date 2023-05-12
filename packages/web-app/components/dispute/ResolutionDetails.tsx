import { Badge, Body3, BodyHeadline, Button, Card } from "@nation3/ui-components";
import { utils } from "ethers";
import { Accordion } from "flowbite-react";
import { useMemo } from "react";
import { useCohort } from "../../hooks/useCohort";
import { AccountDisplay } from "../AccountDisplay";
import { Position, useDispute } from "./context/DisputeResolutionContext";

const SettlementTable = ({ token, positions }: { token: string; positions: Position[] }) => {
	return (
		<>
			{positions.map(({ party, balance }, index) => (
				<div key={index} className="flex rounded-base bg-neutral-c-200 p-min3 justify-between">
					<div className="">
						<Body3 color="neutral-c-500" className="mb-min2">
							Address
						</Body3>
						<div className="shadow rounded-base">
							<AccountDisplay address={party} />
						</div>
					</div>
					<div className="col-start-4 col-end-6 md:col-start-5 md:col-end-5 flex justify-end flex-col">
						<Body3 color="neutral-c-500" className="mb-min2">
							Proposed
						</Body3>
						<Body3>
							{utils.formatUnits(balance)} ${token}
						</Body3>
					</div>
				</div>
			))}
		</>
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
				<div className="flex gap-min3">
					<BodyHeadline>Resolution</BodyHeadline>
					<Badge label={status}></Badge>
				</div>
				{/* <div className="flex flex-col md:flex-row gap-1">
					{mark && <ActionBadge label="Fingerprint" data={n3utils.shortenHash(mark)} />}
					{status == "Approved" && unlockTime && (
						<ActionBadge label="Appeal time left" data={<CountDown seconds={timeLeft} />} />
					)}
				</div> */}
			</div>
			<div className="flex flex-col gap-min3">
				{settlement && <SettlementTable token={token} positions={settlement} />}
			</div>
		</div>
	);
};

export const ResolutionDetails = () => {
	const { dispute, resolution } = useDispute();

	if (resolution) {
		return (
			<Card title="" className="border-sc-c-orange1 mb-base">
				<ResolutionDataDisplay
					mark={resolution.id}
					status={resolution.status}
					token={dispute.collateralToken?.symbol ?? ""}
					settlement={resolution.settlement ?? []}
					unlockTime={resolution.unlockTime}
				/>
			</Card>
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
										<AccountDisplay address={confirmations[0].owner} /> | {confirmations.length}/
										{confirmationsRequired} approvals
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
