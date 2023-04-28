// TermsCard.tsx

import {
	Body2,
	Button,
	DropInput,
	HeadlineBasic,
	InfoAlert,
	TextInput,
} from "@nation3/ui-components";
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
	const { title, terms, id, setTitle, setTerms } = useAgreementCreation();

	const defaultTitle = useMemo(() => `Agreement #${trimHash(id.toUpperCase())}`, [id]);

	useEffect(() => {
		setTerms("#### Agreement test");
		setTitle("Agreement");
	}, []);

	return (
		<section className={cx("")}>
			<>
				{/* <div className="text-gray-800">
            <h1 className="font-display font-medium text-2xl">{t("create.header")}</h1>
        </div> */}
				<div className="flex flex-col gap-base mt-base">
					<HeadlineBasic className="">{t("create.agreementTerms.title")}</HeadlineBasic>
					<div className="flex flex-col">
						<Body2 className="flex font-display">{t("create.agreementTitle.title")}</Body2>
						<TextInput
							value={title}
							placeholder={defaultTitle}
							focusColor="pr-c-green2"
							onChange={(e: ChangeEvent<HTMLInputElement>) => {
								setTitle(e.target.value);
							}}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Body2>Markdown file</Body2>
						<DropInput
							dropzoneConfig={{
								accept: { "text/markdown": [".md"] },
								maxFiles: 1,
								onDrop: (acceptedFiles: File[]) => {
									acceptedFiles[0].text().then((text: string) => setTerms(text));
								},
							}}
							showFiles={true}
						/>
					</div>
					{!terms && <InfoAlert message={t("create.agreementTerms.warning")} />}
				</div>
				<hr />
			</>
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
