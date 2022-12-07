import {
	Table,
	ActionBadge,
	Badge,
	AddressDisplay,
	utils as n3utils,
} from "@nation3/ui-components";
import { utils } from "ethers";
import { Position, useDispute } from "./context/DisputeResolutionContext";
import { useProvider, useBlockNumber } from "wagmi";
import { useState, useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

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

const useTimeLeft = (
	futureBlock: number,
): { data: { days: number; hours: number; minutes: number } } => {
	const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
	const { data: currentBlock } = useBlockNumber();

	useEffect(() => {
		if (!currentBlock) return;
		const blockTime = 12;
		const secondsDiff = (futureBlock - currentBlock) * blockTime * 1000;
		const futureDate = new Date(+new Date() + secondsDiff);
		const diff = +futureDate - +new Date();

		setTimeLeft({
			days: Math.floor(diff / (1000 * 60 * 60 * 24)),
			hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
			minutes: Math.floor((diff / 1000 / 60) % 60),
		});
	}, [currentBlock]);
	return { data: timeLeft };
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
	const { data: timeLeft } = useTimeLeft(unlockBlock);
	console.log(timeLeft);

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-1">
				<div className="flex flex-row items-center justify-between">
					<h1 className="font-display font-medium text-lg truncate">Resolution</h1>
					<Badge textColor="gray-800" bgColor="gray-100" className="font-semibold" label={status} />
				</div>
				<div className="flex flex-col md:flex-row gap-1">
					<ActionBadge label="Fingerprint" data={n3utils.shortenHash(mark)} />

					<ActionBadge
						label="Time to enactment"
						data={`${timeLeft.days}d:${timeLeft.hours}h:${timeLeft.minutes}m`}
						icon={
							<a href="https://docs.nation3.org" target="_blank" rel="noreferrer noopener">
								<InformationCircleIcon width={16} />
							</a>
						}
					/>
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
