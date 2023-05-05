import { constants } from "ethers";

import { useAgreementCreate } from "../../hooks/useAgreement";

import { preparePutToIPFS } from "../../lib/ipfs";
import { generateAgreementMetadata } from "../../utils";

import { Button, Card, HeadlineBasic, ModalNew } from "@nation3/ui-components";

import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "../../../ui-components/src/components/Atoms/Spinner";
import AgreementCard from "../agreement/AgreementCard/AgreementCard";
import { useAgreementCreation } from "./context/AgreementCreationContext";

interface AgreemetCreationPreviewProps {
	setActiveStep: (step: number) => void;
}

export const AgreementCreationPreview: React.FC<AgreemetCreationPreviewProps> = ({
	setActiveStep,
}) => {
	const router = useRouter();
	const {
		title,
		terms,
		termsHash,
		token,
		id,
		salt,
		positions,
		filePass,
		fileName,
		fileStatus,
		changeView,
	} = useAgreementCreation();

	const {
		create,
		isLoading: createLoading,
		isTxSuccess: createSuccess,
		// isError: createError,
		isProcessing: createProcessing,
	} = useAgreementCreate({});

	useEffect(() => {
		if (createSuccess) {
			router.push(`/agreement/${id}`);
		}
		console.log("$$$ POSITIONS => ", positions);
	}, [router, terms, positions, createSuccess, id, title]);

	const submit = async () => {
		setIsOpen(true);
		const metadata = await generateAgreementMetadata({
			title,
			terms,
			positions,
			filePass,
			fileName,
			fileStatus,
		});

		const { put } = await preparePutToIPFS(metadata);
		const cid = await put();
		const metadataURI = `ipfs://${cid}`;
		console.log(`$$$ CID IPFS ${metadataURI}`);

		create({
			termsHash: metadata.termsHash,
			criteria: metadata.criteria,
			metadataURI,
			token: token?.address ?? constants.AddressZero,
			salt,
		});
	};

	// MODAL CONTROLLER
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const handleOpen = () => {
		setIsOpen(true);
	};
	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<>
			<article className="flex flex-col w-full gap-min3 md:gap-base">
				<HeadlineBasic className="mt-min3 md:mt-base">Review & Submit </HeadlineBasic>
				<section className="w-full md:bg-neutral-c-200 rounded-md md:p-base flex justify-center">
					<div className="flex max-w-sm w-full">
						<AgreementCard
							token={token}
							id={id ?? constants.HashZero}
							title={title}
							status={"Preview"}
							termsHash={termsHash ?? constants.HashZero}
							terms={terms}
							fileName={fileName}
							fileStatus={fileStatus}
							positions={positions}
						/>
					</div>
				</section>

				{/* Action buttons */}
				<div className="flex justify-between gap-min3 mt-min2 sm:mt-mt-min3">
					<Button
						label={<div className="flex items-center gap-1">{"Back"}</div>}
						disabled={createLoading || createProcessing}
						bgColor="slate"
						onClick={() => setActiveStep(2)}
					/>
					<Button
						label={
							<div className="flex items-center gap-1">
								{/* <CheckBadgeIcon className="w-5 h-5" /> */}
								{"Create Agreement"}
							</div>
						}
						isLoading={createLoading || createProcessing}
						disabled={createLoading || createProcessing}
						onClick={() => submit()}
					/>
				</div>

				{/* MODAL */}
				<ModalNew isOpen={isOpen} onClose={handleClose}>
					<motion.div
						className="w-full rounded-lg flex justify-center items-center"
						initial={{ opacity: 0, y: -10, boxShadow: "0px 0px 0 rgba(0, 0, 0, 0.0)" }}
						animate={{ opacity: 1, y: 0, boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)" }}
						transition={{ duration: 0.15 }}
					>
						<Card>
							<div>
								<HeadlineBasic>Preparing Terms file</HeadlineBasic>
								<div>Cool animation here... </div>
								<Spinner className="w-5 h-5" />
							</div>
						</Card>
					</motion.div>
				</ModalNew>
			</article>
		</>
	);
};
