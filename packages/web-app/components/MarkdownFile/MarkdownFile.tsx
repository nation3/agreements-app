import {
	Body1,
	Body3,
	BodyHeadline,
	ScreenType,
	useScreen,
	Button,
	DropInput,
	IconRenderer,
	ModalNew,
	N3Document,
	TextInput,
	utils as n3utils,
} from "@nation3/ui-components";
import cx from "classnames";
import { constants } from "ethers";
import { motion } from "framer-motion";
import MarkdownIt from "markdown-it";
import { FC, useEffect, useState } from "react";
import { decryptAES } from "../../utils/crypto";
import { hexHash } from "../../utils/hash";
import AgreementStatus from "../agreement/AgreementStatus";
import { LinkedMarkdownLocalViewer } from "./LinkedMarkDownComponents";
import styles from "./MarkdownFile.module.scss";

export interface MarkdownFileProps {
	fileName?: string;
	termsFile: string;
	isCreating?: boolean;
	hash: string;
	fileStatus: "public" | "public-encrypted" | "private" | string;
}

const MarkdownFile: FC<MarkdownFileProps> = (props) => {
	const { termsFile, hash, fileName, fileStatus, isCreating } = props;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [password, setPassword] = useState("");
	const [markdownContent, setMarkdownContent] = useState<any>("");
	const [isDecrypted, setIsDecrypted] = useState(false);
	const { screen } = useScreen();

	// NULL FOR EMPTY STATE
	const [isValid, setIsValid] = useState<boolean | null>(null);

	const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
	// Update accepted files when the terms or fileName change
	useEffect(() => {
		if (termsFile && fileName) {
			const file = new File([termsFile], fileName, { type: "text/markdown" });
			setAcceptedFiles([file]);
		} else {
			setAcceptedFiles([]);
		}
	}, [termsFile, fileName]);

	/* INIT MARKDOWN */
	const md = new MarkdownIt();

	const loadTermsFile = async (termsFile: string) => {
		const ipfsLinkRegex = /Import\s+ipfs:\/\/\S+/g;
		const matches = termsFile.match(ipfsLinkRegex);
		const mdFile = md.render(termsFile);

		if (matches) {
			// const mdFile = md.render(termsFile);
			// const mdFile = await renderMarkdown(termsFile, {});
			setMarkdownContent(
				termsFile.length > 0 ? (
					<div className={cx("content px-base py-double", styles.contentHolder)}>
						<div className={cx("prose prose-blue px-min3", styles["markdown-body"])}>
							<LinkedMarkdownLocalViewer file={termsFile} />
						</div>
					</div>
				) : (
					""
				),
			);
		} else {
			// const mdFile = await renderMarkdown(termsFile, {});
			setMarkdownContent(
				<div className={cx("content px-base py-double", styles.contentHolder)}>
					<div
						className={cx("prose prose-blue", styles["markdown-body"])}
						dangerouslySetInnerHTML={{ __html: mdFile }}
					/>
				</div>,
			);
		}
	};

	useEffect(() => {
		loadTermsFile(termsFile);
	}, [termsFile]);

	const handlePasswordSubmit = () => {
		const decryptedTerms = decryptAES(termsFile, password);
		const termsHash = hexHash(decryptedTerms);
		termsHash === hash ? setIsValid(true) : setIsValid(null);
		loadTermsFile(decryptedTerms);
		setIsDecrypted(true);
	};

	const renderContent = () => {
		switch (fileStatus) {
			case "public":
				return <>{markdownContent}</>;
			case "public-encrypted":
				return (
					<>
						{!isDecrypted ? (
							<div className="w-full p-base flex flex-col gap-min3">
								<div className="flex">
									<TextInput
										label="Unlock file"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter password"
									/>
								</div>
								<div className="flex">
									<Button label="Unlock file" onClick={handlePasswordSubmit} />
								</div>
							</div>
						) : (
							<>{markdownContent}</>
						)}
					</>
				);
			case "private":
				return (
					<>
						{!isValid ? (
							<div className="px-base pt-base w-full">
								<Body1 color="neutral-c-700" className="mb-base">
									Validate & preview your terms file
								</Body1>
								<DropInput
									label="Drop your local terms file"
									acceptedFiles={acceptedFiles}
									dropzoneConfig={{
										accept: { "text/markdown": [".md"] },
										maxFiles: 1,
										onDrop: (acceptedFiles: File[]) => {
											acceptedFiles[0].text().then((text: string) => {
												const termsHash = hexHash(text);
												if (termsHash === hash) {
													setIsValid(true);
													loadTermsFile(text);
												} else {
													setIsValid(false);
												}
											});
											setAcceptedFiles(acceptedFiles);
										},
									}}
									showFiles={true}
								/>
							</div>
						) : (
							<>{markdownContent}</>
						)}
					</>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<div
				className="flex items-center gap-min2 cursor-pointer shadow-sm w-auto rounded-base pr-min2 bg-white"
				onClick={() => setIsModalOpen(true)}
			>
				<IconRenderer icon={<N3Document />} backgroundColor={"pr-c-green1"} size={"xs"} />
				<Body3 className="text-neutral-c-800">
					{fileName ? fileName : n3utils.shortenHash(hash ?? constants.HashZero)}
				</Body3>
			</div>

			{/* POPPING TERMS MODAL  */}
			<ModalNew
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setIsValid(null);
					setAcceptedFiles([]); //
				}}
			>
				<motion.div
					key="modal-content"
					initial={{ opacity: 0, y: screen == ScreenType.Desktop ? -10 : +20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: screen == ScreenType.Desktop ? -10 : +20 }}
					transition={{ duration: 0.2 }}
					className="flex md:h-auto h-full w-full md:max-w-3xl md:m-0 justify-center sm-only:items-end"
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<section
						className={cx(
							"w-full md:h-auto h-full bg-white sm-only:rounded-t-lg md:rounded-lg shadow-md border-2 border-neutral-c-200 flex items-center flex-col overflow-hidden",
							styles.markdownContainer,
						)}
					>
						<div className="flex gap-base w-full p-base border-b-2 border-neutral-c-300 sticky top-0 bg-white sticky:shadow">
							<IconRenderer
								customSize={60}
								icon={<N3Document />}
								backgroundColor={"pr-c-green1"}
								size={"sm"}
							/>
							<div className="flex flex-col gap-min1">
								<BodyHeadline color="neutral-c-700" className="ml-min2">
									{" "}
									Terms File Preview{" "}
								</BodyHeadline>
								<div className="flex flex-wrap gap-min3 mt-min2">
									{isValid ? (
										<div className="flex border-2 border-neutral-c-200 ml-min2 w-auto rounded-base px-min2  bg-pr-c-green1">
											<Body3 color="neutral-c-700" className="text-xs">
												Valid terms 💚
											</Body3>
										</div>
									) : isValid === false ? (
										<div className="flex border-2 border-sc-c-orange3 ml-min2 w-auto rounded-base px-min2  bg-sc-c-orange1">
											<Body3 color="neutral-c-700" className="text-xs">
												Invalid terms 📄
											</Body3>
										</div>
									) : (
										<></>
									)}
									{fileName && (
										<div className="flex border-2 border-neutral-c-200 w-auto rounded-base px-min2  bg-white">
											<Body3 color="neutral-c-400" className="text-xs">
												{fileName}
											</Body3>
										</div>
									)}
									{hash && (
										<div className="flex border-2 border-neutral-c-200 w-auto rounded-base px-min2  bg-white">
											<Body3 color="neutral-c-700" className="text-xs">
												<span className="text-neutral-c-400 mr-min3">File hash</span>
												{n3utils.shortenHash(hash ?? constants.HashZero)}
											</Body3>
										</div>
									)}
									<AgreementStatus fileStatus={fileStatus} />
								</div>
							</div>
						</div>

						{!isCreating ? renderContent() : <>{markdownContent}</>}
					</section>
				</motion.div>
			</ModalNew>
		</>
	);
};

export default MarkdownFile;
