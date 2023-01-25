import React, { useCallback, useEffect, useState } from "react";
import { useAgreementData } from "./context/AgreementDataContext";
import { PositionMap } from "./context/types";
import { PositionStatusBadge } from "../../components";
import {
	Table,
	Button,
	ActionBadge,
	utils as n3utils,
	AddressDisplay,
	useScreen,
	ScreenType,
} from "@nation3/ui-components";
import { utils, BigNumber, constants } from "ethers";
import { useProvider } from "wagmi";
import { Modal } from "flowbite-react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { AgreementConstants } from "./AgreementConstants";
import { CardHeader } from "../CardHeader";

interface AgreementDataDisplayProps {
	id: string;
	title: string;
	status: string;
	termsHash: string;
}

const PositionsTable = ({ positions }: { positions: PositionMap | undefined }) => {
	const provider = useProvider({ chainId: 1 });
	const { screen } = useScreen();

	return (
		<Table
			columns={
				screen === ScreenType.Desktop
					? ["participant", "stake", "status"]
					: ["participant", "stake"]
			}
			data={Object.entries(positions ?? {}).map(([account, { balance, status }], index) =>
				screen === ScreenType.Desktop
					? [
							<AddressDisplay key={index} ensProvider={provider} address={account} />,
							<b key={index}> {utils.formatUnits(BigNumber.from(balance))} $NATION</b>,
							<PositionStatusBadge key={index} status={status} />,
					  ]
					: [
							<AddressDisplay key={index} ensProvider={provider} address={account} />,
							<b key={index}> {utils.formatUnits(BigNumber.from(balance))} $NATION</b>,
					  ],
			)}
		/>
	);
};

export const AgreementDataDisplay = ({
	id,
	title,
	status,
	termsHash,
}: AgreementDataDisplayProps) => {
	const [isHashCopied, setIsHashCopied] = useState<boolean>(false);
	const [isAgreementId, setIsAgreementId] = useState<boolean>(false);
	const [isTermsModalUp, setIsTermsModalUp] = useState<boolean>(false);

	const copyAgreementId = useCallback(() => {
		if (id) {
			setIsAgreementId(true);
			navigator.clipboard.writeText(String(id));
			setTimeout(() => setIsAgreementId(false), 1000);
		}
	}, [id]);

	const copyTermsHash = useCallback(() => {
		if (termsHash) {
			setIsHashCopied(true);
			navigator.clipboard.writeText(String(termsHash));
			setTimeout(() => setIsHashCopied(false), 1000);
		}
	}, [termsHash]);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useEffect(() => {}, [isHashCopied, isAgreementId]);

	return (
		<>
			<div className="flex flex-col gap-3 text-gray-700">
				<CardHeader title={title} id={id} status={status} />
				<div className="flex flex-col md:flex-row gap-1 justify-start md:items-center">
					<ActionBadge
						label="ID"
						tooltip
						tooltipContent={isAgreementId ? "Copied" : "Click to copy"}
						data={n3utils.shortenHash(id ?? constants.HashZero)}
						dataAction={copyAgreementId}
					/>
					<div className="flex items-center">
						<ActionBadge
							tooltip
							tooltipContent={isHashCopied ? "Copied" : "Click to copy"}
							label="Terms hash"
							data={n3utils.shortenHash(termsHash ?? constants.HashZero)}
							icon={<InformationCircleIcon className="w-4 h-4" />}
							iconAction={() => setIsTermsModalUp(true)}
							dataAction={copyTermsHash}
						/>
					</div>
				</div>
			</div>

			{/* TERMS HASH INFO MOCAL */}
			<Modal show={isTermsModalUp} onClose={() => setIsTermsModalUp(false)}>
				<Modal.Header>{AgreementConstants.termsHash}</Modal.Header>
				<Modal.Body>
					<div className="space-y-6">
						<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
							{AgreementConstants.termsDescription}
						</p>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button label="Close" onClick={() => setIsTermsModalUp(false)}></Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export const AgreementDetails = () => {
	const { id, title, status, termsHash, positions } = useAgreementData();

	return (
		<>
			{/* Title and details */}
			<AgreementDataDisplay
				id={id}
				title={title || "Agreement"}
				status={status || "Unknonw"}
				termsHash={termsHash || constants.HashZero}
			/>
			{/* Participants table */}
			<PositionsTable positions={positions} />
		</>
	);
};
