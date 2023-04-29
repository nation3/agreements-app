import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { constants } from "ethers";

import { useAgreementCreate } from "../../hooks/useAgreement";

import { preparePutToIPFS } from "../../lib/ipfs";
import { generateAgreementMetadata } from "../../utils";

import { Button, HeadlineBasic } from "@nation3/ui-components";

import { useRouter } from "next/router";
import React, { useEffect } from "react";
import AgreementCard from "../agreement/AgreementCard/AgreementCard";
import { useAgreementCreation } from "./context/AgreementCreationContext";

interface AgreemetCreationPreviewProps {
	setActiveStep: (step: number) => void;
}

export const AgreementCreationPreview: React.FC<AgreemetCreationPreviewProps> = ({
	setActiveStep,
}) => {
	const router = useRouter();
	const { title, terms, fileName, termsHash, token, id, salt, positions, changeView } =
		useAgreementCreation();

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
		console.log("POSITIONS => ", positions);
	}, [router, terms, positions, createSuccess, id, title]);

	const submit = async () => {
		const metadata = generateAgreementMetadata({ title, terms, positions });

		const { cid } = await preparePutToIPFS(metadata);
		const metadataURI = `ipfs://${cid}`;

		create({
			termsHash: metadata.termsHash,
			criteria: metadata.criteria,
			metadataURI,
			token: token?.address ?? constants.AddressZero,
			salt,
		});
	};

	return (
		<>
			<article className="flex flex-col gap-base">
				<HeadlineBasic className="mt-base">Review & Submit </HeadlineBasic>
				<section className="bg-neutral-c-200 rounded-md p-base flex justify-center">
					<div className="flex max-w-sm w-full">
						<AgreementCard
							token={token}
							id={id ?? constants.HashZero}
							title={title}
							status={"Preview"}
							termsHash={termsHash ?? constants.HashZero}
							terms={terms}
							fileName={fileName}
							positions={positions}
						/>
					</div>
				</section>

				{/* Action buttons */}
				<div className="flex justify-between gap-2">
					<Button
						label={<div className="flex items-center gap-1">{"Back"}</div>}
						disabled={createLoading || createProcessing}
						bgColor="slate"
						onClick={() => setActiveStep(2)}
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
			</article>
			{/* <section>
				<AgreementDataDisplay
					id={id ?? constants.HashZero}
					title={title}
					status={"Preview"}
					termsHash={termsHash ?? constants.HashZero}
				/>
				<Table
					columns={["participant", "stake"]}
					data={positions.map(({ account, balance }, index) => [
						<AccountDisplay key={index} address={account} />,
						<b key={index}>
							{utils.formatUnits(BigNumber.from(balance))} ${token?.symbol ?? ""}
						</b>,
					])}
				/>
				<InfoAlert message="Keep the terms file safe. You will need to submit it as evidence in the case of a dispute." />
				
			</section> */}
		</>
	);
};
