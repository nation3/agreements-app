import React, { useState, useEffect, useCallback } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useSigner } from "wagmi";
import { Signer, utils, constants, BigNumber } from "ethers";
import {
	Card,
	Table,
	Button,
	BackLinkButton,
	ActionBadge,
	Alert,
	InfoAlert,
	utils as n3utils,
} from "@nation3/ui-components";

import { PositionStatusBadge } from "../../components";
import { fetchMetadata, AgreementMetadata } from "../../utils/metadata";

import { useAgreementRead, useAgreementActions } from "../../hooks/useAgreement";

const AgreementDetailPage = () => {
	const router = useRouter();
	const { query, isReady } = router;
	const { data: signer } = useSigner();
	const [availableActions, setAvailableActions] = useState({
		join: false,
		finalize: false,
		dispute: false,
		withdraw: false,
	});

	const [title, setTitle] = useState("Agreement");
	const [termsHash, setTermsHash] = useState<string>();
	const [metadataURI, setMetadataURI] = useState<string>();
	const [resolvers, setResolvers] = useState<{
		[key: string]: { balance: string; proof: string[] };
	}>();
	const [positions, setPositions] = useState<{
		[key: string]: { balance: string; status: number };
	}>();

	const {
		params: agreementParams,
		positions: agreementPositions,
		status: agreementStatus,
	} = useAgreementRead({ id: String(query.id), enabled: isReady });

	const { join, finalize, dispute, withdraw } = useAgreementActions({
		id: String(query.id),
		signer: signer as Signer,
		resolvers,
	});

	const setMetadata = (metadata: AgreementMetadata) => {
		if (metadata.title) {
			setTitle(metadata.title);
		}

		if (metadata.resolvers) {
			setResolvers({ ...resolvers, ...metadata.resolvers });
		}
	};

	/* Update state when fetched agreement params */
	useEffect(() => {
		if (agreementParams?.termsHash && agreementParams.termsHash != termsHash) {
			setTermsHash(agreementParams.termsHash);
		}
		if (agreementParams?.metadataURI && agreementParams.metadataURI != metadataURI) {
			setMetadataURI(agreementParams.metadataURI);
			fetchMetadata(agreementParams.metadataURI).then((metadata) => setMetadata(metadata));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [agreementParams]);

	/* Update positions when fetched agreement positions or new resolvers */
	useEffect(() => {
		let knownPositions: { [key: string]: { balance: string; status: number } } = {};
		if (resolvers) {
			knownPositions = Object.entries(resolvers).reduce(
				(result, [account, { balance }]) => ({
					...result,
					[account.toString()]: {
						balance: balance,
						status: 0,
					},
				}),
				knownPositions,
			);
		}
		if (agreementPositions) {
			knownPositions = agreementPositions.reduce(
				(result, [party, balance, status]) => ({
					...result,
					[party.toString()]: {
						balance: balance.toString(),
						status: status,
					},
				}),
				knownPositions,
			);
		}
		if (knownPositions != positions) {
			setPositions(knownPositions);
			signer?.getAddress().then((address) => {
				if (address && knownPositions[address]) {
					if (knownPositions[address].status == 0) {
						setAvailableActions({ ...availableActions, join: true });
					} else if (knownPositions[address].status == 1) {
						setAvailableActions({
							...availableActions,
							join: false,
							dispute: true,
							finalize: true,
						});
					} else if (knownPositions[address].status == 2) {
						setAvailableActions({
							join: false,
							dispute: false,
							finalize: false,
							withdraw: BigNumber.from(knownPositions[address].balance).gt(0),
						});
					}
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [agreementPositions, resolvers, signer]);

	const copyAgreementId = useCallback(() => {
		if (query.id) navigator.clipboard.writeText(String(query.id));
	}, [query.id]);

	const copyTermsHash = useCallback(() => {
		if (termsHash) navigator.clipboard.writeText(String(termsHash));
	}, [termsHash]);

	return (
		<div className="w-full max-w-2xl">
			<BackLinkButton route={"/agreements"} label={"Go back to agreements"} onRoute={router.push} />
			<Card className="flex flex-col gap-8 w-full text-gray-800">
				{/* Title and details */}
				<div className="flex flex-col gap-2 text-gray-700">
					<div className="flex flex-row items-center justify-between">
						<h1 className="font-display font-medium text-2xl truncate">{title}</h1>
					</div>
					<div className="flex items-center gap-1">
						<ActionBadge
							label="ID"
							data={n3utils.shortenHash(String(query.id) ?? constants.HashZero)}
							dataAction={copyAgreementId}
						/>
						<ActionBadge
							label="Terms hash"
							data={n3utils.shortenHash(termsHash ?? constants.HashZero)}
							dataAction={copyTermsHash}
						/>
					</div>
				</div>
				{/* Participant table */}
				<Table
					columns={["participant", "stake", "status"]}
					data={Object.entries(positions ?? {}).map(([account, { balance, status }], index) => [
						n3utils.shortenHash(account),
						<b key={index}> {utils.formatUnits(BigNumber.from(balance))} $NATION</b>,
						<PositionStatusBadge key={index} status={status} />,
					])}
				/>
				{/* Info */}
				{agreementStatus == "Finalized" && (
					<Alert
						icon={<CheckCircleIcon className="w-5 h-5" />}
						message="This agreement has been finalized by all the joined parties."
						color="greensea-200"
						className="bg-opacity-20 text-greensea-700"
					/>
				)}
				{availableActions.join && (
					<InfoAlert message="Verify the terms hash before joining and remember to keep the terms file safe. The terms file will be used as evidence in the case of a dispute." />
				)}
				{/* Action buttons */}
				<div className="flex flex-col gap-2">
					{availableActions.join && (
						<Button label="Join" disabled={!availableActions.join} onClick={() => join()} />
					)}
					{(availableActions.dispute || availableActions.finalize) && (
						<div className="flex gap-2 justify-between">
							<Button
								label="Dispute"
								bgColor="red"
								disabled={!availableActions.dispute}
								onClick={() => dispute()}
							/>
							<Button
								label="Finalize"
								bgColor="greensea"
								disabled={!availableActions.finalize}
								onClick={() => finalize()}
							/>
						</div>
					)}
					{availableActions.withdraw && (
						<Button
							label="Withdraw"
							disabled={!availableActions.withdraw}
							onClick={() => withdraw()}
						/>
					)}
				</div>
			</Card>
		</div>
	);
};

export default AgreementDetailPage;
