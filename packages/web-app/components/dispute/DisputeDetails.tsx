import { useCallback, useMemo, useState, useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Table, Alert, ActionBadge, Button, utils as n3utils } from "@nation3/ui-components";
import { BigNumber, utils, constants } from "ethers";
import { ResolutionDetails, ProposedResolutionDetails } from "./ResolutionDetails";
import { useDispute } from "./context/DisputeResolutionContext";
import { trimHash } from "../../utils/hash";
import { useResolutionExecute } from "../../hooks/useArbitrator";
import { useAccount } from "wagmi";
import { CardHeader } from "../CardHeader";
import { useCohort } from "../../hooks/useCohort";
import { AccountDisplay } from "../AccountDisplay";
import { useConstants } from "../../hooks/useConstants";

export const DisputeDetails = () => {
	const currentTime = Math.floor(Date.now() / 1000);
	const { frameworkAddress } = useConstants();

	const { dispute, resolution: approvedResolution, proposedResolutions } = useDispute();
	const { execute } = useResolutionExecute();
	const { judges } = useCohort();
	const { address } = useAccount();
	const [isHashCopied, setIsHashCopied] = useState<boolean>(false);
	const [isAgreementId, setIsAgreementId] = useState<boolean>(false);

	const isArbitrator = useMemo(() => {
		if (!judges || !address) return false;
		return judges.includes(address);
	}, [judges, address]);

	const copyAgreementId = useCallback(() => {
		if (dispute.id) {
			setIsAgreementId(true);
			navigator.clipboard.writeText(dispute.id);
			setTimeout(() => setIsAgreementId(false), 1000);
		}
	}, [dispute, dispute.id]);

	const copyTermsHash = useCallback(() => {
		if (dispute.termsHash) {
			setIsHashCopied(true);
			navigator.clipboard.writeText(String(dispute.termsHash));
			setTimeout(() => setIsHashCopied(false), 1000);
		}
	}, [dispute, dispute.termsHash]);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useEffect(() => {}, [isHashCopied, isAgreementId]);

	const canBeEnacted = useMemo(() => {
		if (!approvedResolution) return false;
		if (approvedResolution.status == "Appealed") return false;
		return currentTime ? approvedResolution.unlockTime < currentTime : false;
	}, [currentTime, approvedResolution]);

	return (
		<>
			<div className="flex flex-col gap-3 text-gray-700">
				<CardHeader
					title={`Dispute #${trimHash(dispute.id.toUpperCase())}`}
					id={dispute.id}
					status={dispute.status}
				/>
				<div className="flex flex-col md:flex-row gap-1">
					<ActionBadge
						tooltip
						tooltipContent={isAgreementId ? "Copied" : "Click to copy"}
						label="ID"
						data={n3utils.shortenHash(dispute.id ?? constants.HashZero)}
						dataAction={copyAgreementId}
					/>
					<ActionBadge
						tooltip
						tooltipContent={isHashCopied ? "Copied" : "Click to copy"}
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
						<AccountDisplay key={index} address={party} />,
						<b key={index}>
							{" "}
							{utils.formatUnits(BigNumber.from(balance))} ${dispute.collateralToken?.symbol ?? ""}
						</b>,
					]) || []
				}
			/>
			{approvedResolution && (
				<div className="flex flex-col gap-2">
					<div>
						<div className="text-md font-display">Approved resolution</div>
					</div>
					<div className="flex flex-col gap-2 p-4 pb-2 border-4 border-gray-100 rounded-xl bg-white">
						<ResolutionDetails />
						<Button
							label="Enact"
							disabled={!canBeEnacted}
							onClick={() =>
								execute({
									framework: frameworkAddress,
									dispute: dispute.id,
									settlement: approvedResolution.settlement || [],
								})
							}
						/>
					</div>
				</div>
			)}
			{isArbitrator && proposedResolutions.length > 0 && <ProposedResolutionDetails />}
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
