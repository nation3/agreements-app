import {
	Table,
	ActionBadge,
	Badge,
	AddressDisplay,
	utils as n3utils,
	Button,
} from "@nation3/ui-components";
import { utils } from "ethers";
import { Position, useDispute } from "./context/DisputeResolutionContext";
import { useProvider } from "wagmi";
import { Accordion } from "flowbite-react";

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
	unlockBlock,
}: {
	mark?: string;
	status: string;
	settlement: Position[];
	unlockBlock?: number;
}) => {
	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-1">
				<div className="flex flex-row items-center justify-between">
					<h1 className="font-display font-medium text-lg truncate">Resolution</h1>
					<Badge textColor="gray-800" bgColor="gray-100" className="font-semibold" label={status} />
				</div>
				{mark && unlockBlock && (
					<div className="flex flex-col md:flex-row gap-1">
						<ActionBadge label="Fingerprint" data={n3utils.shortenHash(mark)} />
						<ActionBadge label="Executable block" data={unlockBlock} />
					</div>
				)}
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
				unlockBlock={resolution.unlockBlock}
			/>
		);
	} else {
		return <></>;
	}
};

export const ProposedResolutionDetails = () => {
	const { proposedResolutions } = useDispute();

	if (proposedResolutions) {
		return (
			<Accordion alwaysOpen={true}>
				{proposedResolutions.map(({ confirmationsRequired, confirmations, resolution }, i) => {
					return (
						<Accordion.Panel key={i}>
							<Accordion.Title>
								Resolution proposed by {n3utils.shortenHash(confirmations[0].owner)} |{" "}
								{confirmations.length}/{confirmationsRequired} approvals
							</Accordion.Title>
							<Accordion.Content>
								<div className="py-4">
									<ResolutionDataDisplay
										mark={resolution.id}
										status="Proposed"
										settlement={resolution.settlement ?? []}
										unlockBlock={0}
									/>
									{confirmationsRequired > confirmations.length && (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
											<Button label="Reject" bgColor="red" />
											<Button label="Approve" bgColor="green" />
										</div>
									)}
								</div>
							</Accordion.Content>
						</Accordion.Panel>
					);
				})}
			</Accordion>
		);
	} else {
		return <></>;
	}
};
