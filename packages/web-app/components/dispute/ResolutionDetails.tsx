import { Table, ActionBadge, Badge, utils as n3utils } from "@nation3/ui-components";
import { utils } from "ethers";
import { Position, useDispute } from "./context/DisputeResolutionContext";

const SettlementTable = ({ positions }: { positions: Position[] }) => {
	return (
		<Table
			columns={["participant", "stake"]}
			data={positions.map(({ party, balance }, index) => [
				n3utils.shortenHash(party),
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
	mark: string;
	status: string;
	settlement: Position[];
	unlockBlock: number;
}) => {
	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-1">
				<div className="flex flex-row items-center justify-between">
					<h1 className="font-display font-medium text-lg truncate">Resolution</h1>
					<Badge textColor="gray-800" bgColor="gray-100" className="font-semibold" label={status} />
				</div>
				<div className="flex flex-col md:flex-row gap-1">
					<ActionBadge label="Fingerprint" data={n3utils.shortenHash(mark)} />
					<ActionBadge label="Executable block" data={unlockBlock} />
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
				unlockBlock={resolution.unlockBlock}
			/>
		);
	} else {
		return <></>;
	}
};
