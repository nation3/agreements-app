import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { constants, utils, BigNumber } from "ethers";

import { useAgreementCreate } from "../../hooks/useAgreement";

import { hexHash, generateMetadata } from "../../utils";
import { preparePutToIPFS } from "../../lib/ipfs";

import { Button, InfoAlert, Table, ActionBadge, utils as n3utils } from "@nation3/ui-components";
import { PositionStatusBadge } from "../PositionStatusBadge";

import { useAgreementCreation } from "./context/AgreementCreationContext";
import { CreateView } from "./context/types";
import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";

export const AgreementCreationPreview = () => {
	const router = useRouter();
	const { terms, positions, changeView } = useAgreementCreation();
	const termsHash = hexHash(terms);

	const uploadMetadataToIPFS = async () => {
		const metadata = generateMetadata(terms, positions);

		const { put } = await preparePutToIPFS(metadata);

		const cid = await put();
		console.log(`metadata uploaded to ${cid}`);
	};

	const {
		create,
		created,
		isLoading: createLoading,
		isProcessing: createProcessing,
	} = useAgreementCreate({ onSettledSuccess: uploadMetadataToIPFS });

	const submit = async () => {
		const metadata = generateMetadata(terms, positions);

		const { cid } = await preparePutToIPFS(metadata);
		const metadataURI = `ipfs://${cid}`;

		create({ termsHash: metadata.termsHash, criteria: metadata.criteria, metadataURI });
	};

	const copyTermsHash = useCallback(() => {
		if (termsHash) navigator.clipboard.writeText(String(termsHash));
	}, [termsHash]);

	/* Redirect to the agreement page on creation event */
	useEffect(() => {
		if (created?.id) router.push(`/agreements/${created.id}`);
	}, [created, router]);

	return (
		<>
			<div className="flex flex-col gap-2 text-gray-700">
				<div className="flex flex-row items-center justify-between">
					<h1 className="font-display font-medium text-2xl truncate">Agreement</h1>
				</div>
				<div className="flex items-center gap-1">
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
				data={positions.map(({ account, balance }, index) => [
					n3utils.shortenHash(account),
					<b key={index}> {utils.formatUnits(BigNumber.from(balance))} $NATION</b>,
					<PositionStatusBadge key={index} status={0} />,
				])}
			/>
			{/* Info */}
			<InfoAlert message="Keep the terms file safe. You will need to submit it as evidence in the case of a dispute." />
			{/* Action buttons */}
			<div className="flex gap-2">
				<Button
					label={
						<div className="flex items-center gap-1">
							<PencilSquareIcon className="w-5 h-5" />
							{"Edit"}
						</div>
					}
					bgColor="slate"
					onClick={() => changeView(CreateView.Form)}
				/>
				<Button
					label={
						<div className="flex items-center gap-1">
							<CheckBadgeIcon className="w-5 h-5" />
							{"Submit"}
						</div>
					}
					isLoading={createLoading || createProcessing}
					disabled={createLoading || createProcessing}
					onClick={() => submit()}
				/>
			</div>
		</>
	);
};
