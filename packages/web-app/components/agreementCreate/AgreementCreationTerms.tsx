// TermsCard.tsx

import {
	Body2,
	Body3,
	Button,
	DropInput,
	HeadlineBasic,
	InfoAlert,
	PasswordInput,
	TextInput,
	CustomRadioInput
} from "@nation3/ui-components";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { trimHash } from "../../utils";
import { useAgreementCreation } from "./context/AgreementCreationContext";

interface AgreeementTermsProps {
	setActiveStep: (step: number) => void;
}

type RadioDescriptionProps = {
	status: string;
};

export const RadioDescription: React.FC<RadioDescriptionProps> = ({ status }) => {
	const getDescription = () => {
		switch (status) {
			case "private":
				return "The file will only be visible to the parties involved. It needs to be shared personally by each party.";
			case "public":
				return "The terms file will be visible to everyone as it will be uploaded publicly to IPFS.";
			case "public-encrypted":
				return "The terms file will be publicly accessible on IPFS, but it will be encrypted.";
			default:
				return "";
		}
	};

	return (
		<Body3 color="neutral-c-500 md:w-1/2" className="mt-min2 text-sm">
			{getDescription()}
		</Body3>
	);
};

export const AgreementTerms: React.FC<AgreeementTermsProps> = ({ setActiveStep }) => {
	const { t } = useTranslation("common");
	const {
		title,
		terms,
		id,
		fileStatus,
		filePass,
		setTitle,
		setTerms,
		setFileName,
		setFilePass,
		setFileStatus,
		fileName,
		termsHash,
	} = useAgreementCreation();
	const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
	// Update accepted files when the terms or fileName change
	useEffect(() => {
		if (terms && fileName) {
			const file = new File([terms], fileName, { type: "text/markdown" });
			setAcceptedFiles([file]);
		} else {
			setAcceptedFiles([]);
		}
	}, [terms, fileName]);

	const defaultTitle = useMemo(() => `Agreement #${trimHash(id.toUpperCase())}`, [id]);
	const [radioValue, setRadioValue] = useState("private");
	const handleRadioChange = (value: string) => {
		setRadioValue(value);
		setFileStatus(value);
	};

	return (
		<section className="flex flex-col gap-base mt-base">
			<HeadlineBasic className="">{t("create.agreementTerms.title")}</HeadlineBasic>
			<div className="flex flex-col">
				<TextInput
					label={"Agreement name"}
					value={title}
					placeholder={defaultTitle}
					focusColor="pr-c-green2"
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setTitle(e.target.value);
					}}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<DropInput
					label="Agreement terms file"
					acceptedFiles={acceptedFiles}
					dropzoneConfig={{
						accept: { "text/markdown": [".md"] },
						maxFiles: 1,
						onDrop: (acceptedFiles: File[]) => {
							acceptedFiles[0].text().then((text: string) => {
								setTerms(text);
								setFileName(acceptedFiles[0].name);
							});
							setAcceptedFiles(acceptedFiles);
						},
					}}
					showFiles={true}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<Body2 className="mb-min2">{"Terms file status"}</Body2>
				<div className="flex space-x-4">
					<CustomRadioInput
						id="private"
						name="visibility"
						value="private"
						label="Private"
						disabled={!terms}
						checked={radioValue === "private"}
						onChange={handleRadioChange}
					/>
					<CustomRadioInput
						id="public"
						name="visibility"
						value="public"
						label="Public"
						disabled={!terms}
						checked={radioValue === "public"}
						onChange={handleRadioChange}
					/>
					<CustomRadioInput
						id="public-encrypted"
						name="visibility"
						value="public-encrypted"
						label="Public Encrypted"
						disabled={!terms}
						checked={radioValue === "public-encrypted"}
						onChange={handleRadioChange}
					/>
					{/* Description */}
				</div>
				{terms && <RadioDescription status={radioValue} />}
				{radioValue === "public-encrypted" && (
					<PasswordInput
						label={"Encryption password"}
						value={filePass}
						placeholder={"Password: "}
						focusColor="pr-c-green2"
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setFilePass(e.target.value ? e.target.value : "");
						}}
					/>
				)}
			</div>
			{!terms && <InfoAlert message={t("create.agreementTerms.warning")} />}
			<div className="flex justify-between">
				<Button label="Back" onClick={() => setActiveStep(0)} />
				<Button
					disabled={!terms || !title}
					label="Next"
					onClick={() => {
						setTitle(title || defaultTitle);
						setActiveStep(2);
					}}
				/>
			</div>
		</section>
	);
};
