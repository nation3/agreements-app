import { useCallback, useMemo, useState, useEffect } from "react";
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
import { useBlockNumber, useProvider } from "wagmi";
import { useUrl } from "../../hooks";

export const DisputeDetails = () => {
	const provider = useProvider({ chainId: 1 });
	const { data: currentBlock } = useBlockNumber();
	const { dispute, resolution: approvedResolution, proposedResolutions } = useDispute();
	const { execute } = useResolutionExecute();
	const [isHashCopied, setIsHashCopied] = useState<boolean>(false);
	const [isAgreementId, setIsAgreementId] = useState<boolean>(false);

	const { url } = useUrl();

	const copyAgreementId = useCallback(() => {
		if (dispute.id) {
			setIsAgreementId(true);
            navigator.clipboard.writeText(url);
		    setTimeout(() => setIsAgreementId(false), 1000);
        }
	}, [dispute.id]);

	const copyTermsHash = useCallback(() => {
		if (dispute.termsHash) {
			setIsHashCopied(true);
			navigator.clipboard.writeText(String(dispute.termsHash));
			setTimeout(() => setIsHashCopied(false), 1000);
		}
	}, [dispute.termsHash]);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useEffect(() => {}, [isHashCopied, isAgreementId]);

	const canBeEnacted = useMemo(() => {
		if (!approvedResolution) return false;
		if (approvedResolution.status == "Appealed") return false;
		return currentBlock ? approvedResolution.unlockBlock < currentBlock : false;
	}, [currentBlock, approvedResolution]);

	return (
		<>
			<div className="flex flex-col gap-2 text-gray-700">
				<div className="flex flex-row items-center justify-between">
					<h1 className="font-display font-medium text-2xl truncate">Dispute</h1>
					<Badge textColor="gray-800" bgColor="gray-100" className="font-semibold" label="Open" />
				</div>
				<div className="flex flex-col md:flex-row gap-1">
					<ActionBadge
						tooltip
						tooltipProps={{
							style: "light",
							animation: "duration-150",
							content: isAgreementId ? "Copied" : "Click to copy",
						}}
						label="ID"
						data={n3utils.shortenHash(dispute.id ?? constants.HashZero)}
						dataAction={copyAgreementId}
					/>
					<ActionBadge
						tooltip
						tooltipProps={{
							style: "light",
							animation: "duration-150",
							content: isHashCopied ? "Copied" : "Click to copy",
						}}
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
				<div className="flex flex-col gap-2">
					<div>
						<div className="text-md font-display">Approved resolution</div>
						<div className="border-2 rounded-xl"></div>
					</div>
					<div className="flex flex-col gap-2 p-4 pb-2 border-4 border-gray-100 rounded-xl bg-white">
						<ResolutionDetails />
						<Button
							label="Enact"
							disabled={!canBeEnacted}
							onClick={() =>
								execute({
									framework: frameworkAddress,
									id: dispute.id,
									settlement: approvedResolution.settlement || [],
								})
							}
						/>
					</div>
				</div>
			)}
			{proposedResolutions.length > 0 && <ProposedResolutionDetails />}
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
