import {
	Body1,
	Body3,
	BodyHeadline,
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
import MarkdownIt from "markdown-it";
import { FC, useEffect, useState } from "react";
import { decryptAES } from "../../utils/crypto";
import { hexHash } from "../../utils/hash";
import AgreementStatus from "../agreement/AgreementStatus";
import styles from "./MarkdownFile.module.scss";

interface MarkdownFileProps {
	fileName?: string;
	termsFile: string;
	hash: string;
	fileStatus: "public" | "public-encrypted" | "private" | string;
}

const MarkdownFile: FC<MarkdownFileProps> = (props) => {
	const { termsFile, hash, fileName, fileStatus } = props;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [password, setPassword] = useState("");
	const [markdownContent, setMarkdownContent] = useState("");
	const [isDecrypted, setIsDecrypted] = useState(false);

	// NULL FOR EMPTY STATE
	const [isValid, setIsValid] = useState<boolean | null>(false);

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
	useEffect(() => {
		setMarkdownContent(md.render(termsFile));
	}, [termsFile]);

	const handlePasswordSubmit = () => {
		const decryptedTerms = decryptAES(termsFile, password);
		setIsDecrypted(true);
		setMarkdownContent(md.render(decryptedTerms));
	};

	const renderContent = () => {
		switch (fileStatus) {
			case "public":
				return (
					<div className={cx("content px-base py-double", styles.contentHolder)}>
						<div
							className={cx("prose prose-blue", styles["markdown-body"])}
							dangerouslySetInnerHTML={{ __html: markdownContent }}
						/>
					</div>
				);
			case "public-encrypted":
				return (
					<>
						{!isDecrypted ? (
							<>
								<TextInput
									label="Unlock file"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter password"
									className="border border-gray-300 rounded p-2"
								/>
								<Button
									label="Decrypt"
									onClick={handlePasswordSubmit}
									className="bg-blue-500 text-white rounded p-2"
								/>
							</>
						) : (
							<div className={cx("content px-base py-double", styles.contentHolder)}>
								<div
									className={cx("prose prose-blue", styles["markdown-body"])}
									dangerouslySetInnerHTML={{ __html: markdownContent }}
								/>
							</div>
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
													setMarkdownContent(md.render(text));
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
							<div className={cx("content px-base py-double", styles.contentHolder)}>
								<div
									className={cx("prose prose-blue", styles["markdown-body"])}
									dangerouslySetInnerHTML={{ __html: markdownContent }}
								/>
							</div>
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
					// setIsValid(null);
				}}
			>
				<section
					className={cx(
						"w-full bg-white rounded-lg shadow-md border-2 border-neutral-c-200 flex items-center flex-col overflow-hidden",
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
							<div className="flex gap-min3 mt-min2">
								{isValid ? (
									<div className="border-2 border-neutral-c-200 ml-min2 w-auto rounded-base px-min2 h-full bg-pr-c-green1">
										<Body3 color="neutral-c-700" className="text-xs">
											Valid terms 💚
										</Body3>
									</div>
								) : isValid === false ? (
									<div className="border-2 border-sc-c-orange3 ml-min2 w-auto rounded-base px-min2 h-full bg-sc-c-orange1">
										<Body3 color="neutral-c-700" className="text-xs">
											Invalid terms ❌
										</Body3>
									</div>
								) : (
									<></>
								)}
								{fileName && (
									<div className="border-2 border-neutral-c-200 w-auto rounded-base px-min2 h-full bg-white">
										<Body3 color="neutral-c-400" className="text-xs">
											{fileName}
										</Body3>
									</div>
								)}
								{hash && (
									<div className="border-2 border-neutral-c-200 w-auto rounded-base px-min2 h-full bg-white">
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

					{renderContent()}
				</section>
			</ModalNew>
		</>
	);
};

export default MarkdownFile;
