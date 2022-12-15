import React, { useCallback, useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import {
	Table,
	Alert,
	Badge,
	ActionBadge,
	Button,
	AddressDisplay,
	utils as n3utils,
} from "@nation3/ui-components";
import { BigNumber, utils, constants } from "ethers";
import { ResolutionDetails, ProposedResolutionDetails } from "./ResolutionDetails";
import { useDispute } from "./context/DisputeResolutionContext";
import { frameworkAddress } from "../../lib/constants";
import { useResolutionExecute } from "../../hooks/useArbitrator";
import { useProvider } from "wagmi";

export const DisputeDetails = () => {
	const provider = useProvider({ chainId: 1 });
	const { dispute, resolution: approvedResolution, proposedResolutions } = useDispute();
	const { execute } = useResolutionExecute();

	const copyAgreementId = useCallback(() => {
		if (dispute.id) navigator.clipboard.writeText(dispute.id);
	}, [dispute.id]);

	const copyTermsHash = useCallback(() => {
		if (dispute.termsHash) navigator.clipboard.writeText(String(dispute.termsHash));
	}, [dispute.termsHash]);

	useEffect(() => {
		console.log(proposedResolutions);
	}, [proposedResolutions]);

	return (
		<>
			<div className="flex flex-col gap-2 text-gray-700">
				<div className="flex flex-row items-center justify-between">
					<h1 className="font-display font-medium text-2xl truncate">Dispute</h1>
					<Badge textColor="gray-800" bgColor="gray-100" className="font-semibold" label="Open" />
				</div>
				<div className="flex flex-col md:flex-row gap-1">
					<ActionBadge
						label="ID"
						data={n3utils.shortenHash(dispute.id ?? constants.HashZero)}
						dataAction={copyAgreementId}
					/>
					<ActionBadge
						label="Terms hash"
						data={n3utils.shortenHash(dispute.termsHash ?? constants.HashZero)}
						dataAction={copyTermsHash}
					/>
				</div>
			</div>
			<Table
				columns={["participant", "stake"]}
				data={
					dispute.positions?.map(({ party, balance }, index) => [
						<AddressDisplay key={index} ensProvider={provider} address={party} />,
						<b key={index}> {utils.formatUnits(BigNumber.from(balance))} $NATION</b>,
					]) || []
				}
			/>
			{approvedResolution && (
				<div className="flex flex-col gap-2 p-4 pb-2 border-4 border-gray-100 rounded-xl bg-white">
					<ResolutionDetails />
					{approvedResolution.status != "Appealed" && (
						<Button
							label="Execute"
							onClick={() =>
								execute({
									framework: frameworkAddress,
									id: dispute.id,
									settlement: approvedResolution.settlement || [],
								})
							}
						/>
					)}
				</div>
			)}
			<ProposedResolutionDetails />
			{!approvedResolution && !proposedResolutions && (
				<Alert
					icon={<ExclamationTriangleIcon className="w-5 h-5" />}
					message={"No resolution has been approved yet."}
					color="gray-200"
					className="text-gray-700"
				/>
			)}
		</>
	);
};
