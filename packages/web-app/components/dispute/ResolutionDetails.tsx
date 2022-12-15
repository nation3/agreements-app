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

export const ProposedResolutionDetails = () => {
	const { proposedResolutions } = {
		proposedResolutions: [
			{
				id: "0x93c8145808231925bdfb0b683804920aede62d87c74ef10c77b5efac024aa441",
				status: "Proposed",
				mark: "0x7deef04c24a23df6c64099fdef1f570cd10eed944d4c74f67c44953e2b1b81d5",
				unlockBlock: 8062732,
				settlement: [
					{
						party: "0x69ef1478651A439546F8A673a5760069eC981A9b",
						balance: { type: "BigNumber", hex: "0x10a741a462780000" },
					},
					{
						party: "0xE4dceb72667a5a705DE0B2a4F51Fb2B51584A7a7",
						balance: { type: "BigNumber", hex: "0x0b1a2bc2ec500000" },
					},
				],
			},
			{
				id: "0x93c8145808231925bdfb0b683804920aede62d87c74ef10c77b5efac024aa441",
				status: "Proposed",
				mark: "0x7deef04c24a23df6c64099fdef1f570cd10eed944d4c74f67c44953e2b1b81d5",
				unlockBlock: 8062732,
				settlement: [
					{
						party: "0x69ef1478651A439546F8A673a5760069eC981A9b",
						balance: { type: "BigNumber", hex: "0x10a741a462780000" },
					},
					{
						party: "0xE4dceb72667a5a705DE0B2a4F51Fb2B51584A7a7",
						balance: { type: "BigNumber", hex: "0x0b1a2bc2ec500000" },
					},
				],
			},
			{
				id: "0x93c8145808231925bdfb0b683804920aede62d87c74ef10c77b5efac024aa441",
				status: "Approved",
				mark: "0x7deef04c24a23df6c64099fdef1f570cd10eed944d4c74f67c44953e2b1b81d5",
				unlockBlock: 8062732,
				settlement: [
					{
						party: "0x69ef1478651A439546F8A673a5760069eC981A9b",
						balance: { type: "BigNumber", hex: "0x10a741a462780000" },
					},
					{
						party: "0xE4dceb72667a5a705DE0B2a4F51Fb2B51584A7a7",
						balance: { type: "BigNumber", hex: "0x0b1a2bc2ec500000" },
					},
				],
			},
		],
	};
	if (proposedResolutions) {
		const confirmationsRequired = 3;
		const confirmations = [0, 0];
		return (
			<Accordion alwaysOpen={true}>
				{proposedResolutions.map((resolution, i) => {
					return (
						<Accordion.Panel key={i}>
							<Accordion.Title>
								Resolution proposed by {resolution.origin || "test.eth"}, {confirmations.length} out
								of {confirmationsRequired} confirmations
							</Accordion.Title>
							<Accordion.Content>
								<div className="py-4">
									<ResolutionDataDisplay
										mark={resolution.id}
										status={resolution.status}
										settlement={resolution.settlement ?? []}
										unlockBlock={resolution.unlockBlock}
									/>
									{confirmationsRequired > confirmations.length && (
										<Button label="Approve" bgColor="green" />
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
