import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { utils, BigNumber, constants } from "ethers";

import { useAgreementCreate } from "../../hooks/useAgreement";

import { AgreementDataDisplay } from "../agreement/AgreementDetails";
import { generateAgreementMetadata } from "../../utils";
import { preparePutToIPFS } from "../../lib/ipfs";

import { Button, InfoAlert, Table, AddressDisplay } from "@nation3/ui-components";
import { useProvider } from "wagmi";

import { useAgreementCreation } from "./context/AgreementCreationContext";
import { CreateView } from "./context/types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useConstants } from "../../hooks/useConstants";

export const AgreementCreationPreview = () => {
	const router = useRouter();
	const provider = useProvider({ chainId: 1 });
	const { title, terms, termsHash, id, salt, positions, changeView } = useAgreementCreation();
	const { NATION } = useConstants();

	const {
		create,
		isLoading: createLoading,
		isTxSuccess: createSuccess,
		// isError: createError,
		isProcessing: createProcessing,
	} = useAgreementCreate({});

	// TODO: Move it into a proper wrapper/callback instead of a listener
	useEffect(() => {
		const uploadMetadataToIPFS = async () => {
			const metadata = generateAgreementMetadata({ title, terms, positions });
			const { put } = await preparePutToIPFS(metadata);
			const cid = await put();
			console.log(`metadata uploaded to ${cid}`);
		};

		if (createSuccess) {
			uploadMetadataToIPFS()
				.then(() => router.push(`/agreement/${id}`))
				.catch();
		}
	}, [router, terms, positions, createSuccess, id, title]);

	const submit = async () => {
		const metadata = generateAgreementMetadata({ title, terms, positions });

		const { cid } = await preparePutToIPFS(metadata);
		const metadataURI = `ipfs://${cid}`;

		create({
			termsHash: metadata.termsHash,
			criteria: metadata.criteria,
			metadataURI,
			token: NATION,
			salt,
		});
	};

	return (
		<>
			<AgreementDataDisplay
				id={id ?? constants.HashZero}
				title={title}
				status={"Preview"}
				termsHash={termsHash ?? constants.HashZero}
			/>
			{/* Participant table */}
			<Table
				columns={["participant", "stake"]}
				data={positions.map(({ account, balance }, index) => [
					<AddressDisplay key={index} ensProvider={provider} address={account} />,
					<b key={index}> {utils.formatUnits(BigNumber.from(balance))} $NATION</b>,
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
					disabled={createLoading || createProcessing}
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
