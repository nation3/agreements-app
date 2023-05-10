import { constants } from "ethers";

import { useAgreementCreate } from "../../hooks/useAgreement";

import { preparePutToIPFS } from "../../lib/ipfs";
import { generateAgreementMetadata, validateCriteria } from "../../utils";

import { Button, Card, HeadlineBasic, ModalNew } from "@nation3/ui-components";

import {
	AnimationLoader,
	Body3,
	BodyHeadline,
	IllustrationRenderer,
	InfoAlert,
	N3AgreementDone,
	useScreen,
} from "@nation3/ui-components";
import cx from "classnames";
import { motion } from "framer-motion";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import CompleteAnimation from "../../public/animations/Complete.json";
import EncryptingAnimation from "../../public/animations/Encrypting_file.json";
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
		isLoading: isCreateLoading,
		isTxSuccess: isCreateSuccess,
		isError: isCreateError,
		isProcessing: isCreateProcessing,
	} = useAgreementCreate({});
	const { screen } = useScreen();
	const [isAgreementCreated, setisAgreementCreated] = useState<boolean>(false);
	const [isLocalCreateError, setisLocalCreateError] = useState<boolean>(false);

	const submit = async () => {
		setisLocalCreateError(false);
		setIsOpen(true);
		const metadata = await generateAgreementMetadata({
			title,
			terms,
			positions,
			termsPrivacy: fileStatus,
			termsFilename: fileName,
			termsPassword: filePass,
		});

		const { put } = await preparePutToIPFS(metadata);
		const cid = await put();
		const metadataURI = `ipfs://${cid}`;

		create({
			termsHash: metadata.termsHash,
			criteria: metadata.criteria,
			metadataURI,
			token: token?.address ?? constants.AddressZero,
			salt,
		});
	};

	useEffect(() => {
		if (isCreateError) setisLocalCreateError(true);
	}, [isCreateError]);

	// MODAL CONTROLLER
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const handleOpen = () => {
		setIsOpen(true);
	};
	const handleClose = () => {
		setIsOpen(false);
	};

	const isValidCriteria = useMemo(() => validateCriteria(positions), [positions]);

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
				{!isValidCriteria && (
					<InfoAlert
						className="rounded-md text-sm flex"
						message={t("create.agreementPositions.warning")}
					/>
				)}

				<div className="flex justify-between gap-min3 mt-min2 sm:mt-mt-min3">
					<Button
						label={<div className="flex items-center gap-1">{"Back"}</div>}
						disabled={isCreateLoading || isCreateProcessing}
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
						isLoading={isCreateLoading || isCreateProcessing}
						disabled={isCreateLoading || isCreateProcessing}
						onClick={() => submit()}
					/>
				</div>

				{/* MODAL */}
				<ModalNew
					isOpen={isOpen}
					isClosingDisabled={!isAgreementCreated}
					onClose={() => {
						// router.push(`/agreement/${id}`);
					}}
				>
					<motion.div
						key="modal-content"
						initial={{ opacity: 0, y: +20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: +20 }}
						transition={{ duration: 0.2 }}
						className="flex md:h-auto h-full w-full max-w-md md:m-0 justify-center sm-only:items-end shadow rounded-lg"
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<Card size="base" className={cx(isLocalCreateError && "border-2 border-sc-c-orange2")}>
							{/* TODO:   COMPONENTISE */}
							{isLocalCreateError && (
								<div className="flex flex-col gap-base">
									<div className="flex gap-min3">
										<IllustrationRenderer customSize={60} icon={<N3AgreementDone />} size="sm" />
										<div>
											<BodyHeadline color="neutral-c-700" className="mt-min1">
												Agreement creation failed
											</BodyHeadline>
											<Body3 color="neutral-c-500">
												Please, check your wallet status and try again.
											</Body3>
										</div>
									</div>
									<Button
										onClick={() => setIsOpen(false)}
										label="Go back"
										className="w-full text-neutral-c-600"
									></Button>
								</div>
							)}

							{/* TODO:   COMPONENTISE */}
							{!isCreateSuccess && !isLocalCreateError && (
								<div className="flex flex-col gap-base">
									<div className="bg-neutral-c-200 rounded-lg px-base py-double border-2 border-neutral-c-300">
										<AnimationLoader width={200} height={200} animationData={EncryptingAnimation} />
									</div>
									<div className="flex gap-min3">
										<IllustrationRenderer customSize={60} icon={<N3AgreementDone />} size="sm" />
										<div>
											<BodyHeadline color="neutral-c-700" className="mt-min1">
												Preparing Agreement
											</BodyHeadline>
											<Body3 color="neutral-c-500">Please wait, your wallet will prompt.</Body3>
										</div>
									</div>
								</div>
							)}

							{/* TODO:   COMPONENTISE */}
							{isCreateSuccess && (
								<div className="flex flex-col gap-base">
									<div className="bg-neutral-c-200 rounded-lg px-base py-double border-2 border-neutral-c-300">
										<AnimationLoader width={200} height={200} animationData={CompleteAnimation} />
									</div>
									<div className="flex gap-min3">
										<IllustrationRenderer customSize={60} icon={<N3AgreementDone />} size="sm" />
										<div>
											<BodyHeadline color="neutral-c-600" className="mt-min1">
												Your Agreement is live! 🎉
											</BodyHeadline>
											<Body3 color="neutral-c-400">
												Check it and share it with the other parties.
											</Body3>
										</div>
									</div>
									<motion.div
										key="modal-content"
										initial={{ opacity: 0, y: 0, scale: 0.8 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: 0, scale: 0.8 }}
										transition={{ duration: 0.15 }}
										className="w-full flex justify-end"
										onClick={(e) => {
											router.push(`/agreement/${id}`);
										}}
									>
										<Button
											label="Go to your agreement"
											className="w-full text-neutral-c-600"
										></Button>
									</motion.div>
								</div>
							)}
						</Card>
					</motion.div>
				</ModalNew>
			</article>
		</>
	);
};
