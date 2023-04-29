// TermsCard.tsx

import { Button, DropInput, HeadlineBasic, InfoAlert, TextInput } from "@nation3/ui-components";
import cx from "classnames";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useEffect, useMemo } from "react";
import { trimHash } from "../../utils";
import { useAgreementCreation } from "./context/AgreementCreationContext";

interface AgreeementTermsProps {
	setActiveStep: (step: number) => void;
}

export const AgreementTerms: React.FC<AgreeementTermsProps> = ({ setActiveStep }) => {
	const { t } = useTranslation("common");
	const { title, terms, id, setTitle, setTerms, setFileName, fileName, termsHash } =
		useAgreementCreation();

	const defaultTitle = useMemo(() => `Agreement #${trimHash(id.toUpperCase())}`, [id]);

	useEffect(() => {
		setTitle("Agreement");
	}, []);

	return (
		<section className={cx("")}>
			<div className="flex flex-col gap-base my-base">
				<HeadlineBasic className="">{t("create.agreementTerms.title")}</HeadlineBasic>
				<div className="flex flex-col">
					<TextInput
						label={t("create.agreementTitle.title")}
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
						dropzoneConfig={{
							accept: { "text/markdown": [".md"] },
							maxFiles: 1,
							onDrop: (acceptedFiles: File[]) => {
								acceptedFiles[0].text().then((text: string) => {
									setTerms(text);
									setFileName(acceptedFiles[0].name);
								});
							},
						}}
						showFiles={true}
					/>
				</div>
				{!terms && <InfoAlert message={t("create.agreementTerms.warning")} />}
			</div>
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
