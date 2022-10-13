import { ArrowDownTrayIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { constants, utils, BigNumber } from "ethers";

import { useAgreementCreate } from "../../hooks/useAgreement";

import { hexHash, generateMetadata, preparePutToIPFS } from "../../utils";

import { Button, InfoAlert, Table, utils as n3utils } from "@nation3/ui-components";
import { PositionStatusBadge } from "../PositionStatusBadge";

import { useAgreementCreation } from "./context/AgreementCreationContext";
import { CreateView } from "./context/types";

export const AgreementCreationPreview = () => {
	const { terms, positions, changeView } = useAgreementCreation();
	const termsHash = hexHash(terms);

	const uploadMetadataToIPFS = async () => {
		const metadata = generateMetadata(terms, positions);

		const { put } = await preparePutToIPFS(metadata);

		const cid = await put();
		console.log(`metadata uploaded to ${cid}`);
	};

	const { write: createAgreement } = useAgreementCreate({ onSettledSuccess: uploadMetadataToIPFS });

	const create = async () => {
		const metadata = generateMetadata(terms, positions);

		const { cid } = await preparePutToIPFS(metadata);
		const metadataURI = `ipfs://${cid}`;

		createAgreement?.({
			recklesslySetUnpreparedArgs: [
				{ termsHash: metadata.termsHash, criteria: metadata.criteria, metadataURI: metadataURI },
			],
		});
	};

	return (
		<>
			<div className="text-gray-700">
				<div className="flex flex-row items-center justify-between">
					<h1 className="font-display font-medium text-2xl truncate">Agreement</h1>
				</div>
				<span>
					ID {n3utils.shortenHash(constants.HashZero)} | Terms hash{" "}
					{n3utils.shortenHash(termsHash ?? constants.HashZero)}
				</span>
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
					onClick={() => create()}
				/>
			</div>
		</>
	);
};
