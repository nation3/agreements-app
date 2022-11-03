import React, { useCallback } from "react";
import { useAgreementData } from "./context/AgreementDataContext";
import { PositionMap } from "./context/types";
import { PositionStatusBadge } from "../../components";
import { Table, Badge, ActionBadge, utils as n3utils } from "@nation3/ui-components";
import { utils, BigNumber, constants } from "ethers";

interface AgreementDataDisplayProps {
	id: string;
	title: string;
	status: string;
	termsHash: string;
}

const AgreementHeader = ({ title, status }: { title: string; status: string }) => {
	return (
		<div className="flex flex-row items-center justify-between">
			<h1 className="font-display font-medium text-2xl truncate">{title}</h1>
			<Badge textColor="gray-800" bgColor="gray-100" className="font-semibold" label={status} />
		</div>
	);
};

const PositionsTable = ({ positions }: { positions: PositionMap | undefined }) => {
	return (
		<Table
			columns={["participant", "stake", "status"]}
			data={Object.entries(positions ?? {}).map(([account, { balance, status }], index) => [
				n3utils.shortenHash(account),
				<b key={index}> {utils.formatUnits(BigNumber.from(balance))} $NATION</b>,
				<PositionStatusBadge key={index} status={status} />,
			])}
		/>
	);
};

const AgreementDataDisplay = ({ id, title, status, termsHash }: AgreementDataDisplayProps) => {
	const copyAgreementId = useCallback(() => {
		if (id) navigator.clipboard.writeText(id);
	}, [id]);

	const copyTermsHash = useCallback(() => {
		if (termsHash) navigator.clipboard.writeText(String(termsHash));
	}, [termsHash]);

	return (
		<div className="flex flex-col gap-2 text-gray-700">
			<AgreementHeader title={title} status={status} />
			<div className="flex items-center gap-1">
				<ActionBadge
					label="ID"
					data={n3utils.shortenHash(id ?? constants.HashZero)}
					dataAction={copyAgreementId}
				/>
				<ActionBadge
					label="Terms hash"
					data={n3utils.shortenHash(termsHash ?? constants.HashZero)}
					dataAction={copyTermsHash}
				/>
			</div>
		</div>
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
