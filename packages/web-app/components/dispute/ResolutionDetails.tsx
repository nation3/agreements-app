import { utils } from "ethers";
import { Position, useDispute } from "./context/DisputeResolutionContext";
import { useProvider } from "wagmi";
import { Accordion } from "flowbite-react";
import { useCohort } from "../../hooks/useCohort";
import { CountDown } from "../../components/CountDown";
import {
	ActionBadge,
	AddressDisplay,
	Button,
	Table,
	utils as n3utils,
} from "@nation3/ui-components";
import { useMemo } from "react";
import { CardHeader } from "../CardHeader";

const SettlementTable = ({ positions }: { positions: Position[] }) => {
	const provider = useProvider({ chainId: 1 });

	return (
		<Table
			columns={["participant", "stake"]}
			data={positions.map(({ party, balance }, index) => [
				<AddressDisplay key={index} ensProvider={provider} address={party} />,
				<b key={index}> {utils.formatUnits(balance)} $NATION</b>,
			])}
		/>
	);
};

const ResolutionDataDisplay = ({
	mark,
	status,
	settlement,
	unlockTime,
}: {
	mark?: string;
	status: string;
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
					{unlockTime && (
						<ActionBadge label="Appeal time left" data={<CountDown seconds={timeLeft} />} />
					)}
				</div>
			</div>
			{settlement && <SettlementTable positions={settlement} />}
		</div>
	);
};

export const ResolutionDetails = () => {
	const { resolution } = useDispute();

	if (resolution) {
		return (
			<ResolutionDataDisplay
				mark={resolution.id}
				status={resolution.status}
				settlement={resolution.settlement ?? []}
				unlockTime={resolution.unlockTime}
			/>
		);
	} else {
		return <></>;
	}
};

export const ProposedResolutionDetails = () => {
	const provider = useProvider({ chainId: 1 });
	const { proposedResolutions } = useDispute();
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
										<AddressDisplay ensProvider={provider} address={confirmations[0].owner} /> |{" "}
										{confirmations.length}/{confirmationsRequired} approvals
									</Accordion.Title>
									<Accordion.Content>
										<div className="flex flex-col gap-8">
											<ResolutionDataDisplay
												status="Proposed"
												settlement={resolution.settlement ?? []}
											/>
											{confirmationsRequired > confirmations.length && (
												<div className="flex flex-col md:flex-row gap-2">
													<Button label="Reject" bgColor="red" onClick={() => reject(txNonce)} />
													<Button
														label="Approve"
														bgColor="greensea"
														onClick={() => approve(txHash)}
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
