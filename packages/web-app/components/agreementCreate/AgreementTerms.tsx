// TermsCard.tsx

import { useAgreementCreation } from "./context/AgreementCreationContext";
import { useMemo, ChangeEvent } from "react";
import { TextInput, DropInput, InfoAlert } from "@nation3/ui-components";
import { HeadlineBasic, Body2, Button } from "@nation3/ui-components";
import { useTranslation } from "next-i18next";
import { trimHash } from "../../utils";
import cx from "classnames";

interface AgreeementTermsProps {
	setActiveStep: (step: number) => void;
	openTokenModal: (status: boolean) => void;
}

export const AgreementTerms: React.FC<AgreeementTermsProps> = ({
	setActiveStep,
	openTokenModal,
}) => {
	const { t } = useTranslation("common");
	const { title, terms, id, setTitle, setTerms } = useAgreementCreation();

	const defaultTitle = useMemo(() => `Agreement #${trimHash(id.toUpperCase())}`, [id]);

	return (
		<section className={cx("")}>
			<>
				{/* <div className="text-gray-800">
            <h1 className="font-display font-medium text-2xl">{t("create.header")}</h1>
        </div> */}
				<div className="flex flex-col gap-4">
					<div>
						<HeadlineBasic className="font-display font-medium text-xl">
							{t("create.agreementTerms.title")}
						</HeadlineBasic>
						{/* <Body1>{t("create.agreementTerms.description")}</Body1>
                <GradientLink
                    href="https://docs.nation3.org/agreements/creating-an-agreement"
                    caption="Learn more"
                /> */}
					</div>
					<div className="flex flex-col gap-4">
						<Body2 className="flex gap-1 font-display">
							<span className="text-lg font-medium">{t("create.agreementTitle.title")}</span>
							{/* <span className="text-md text-slate-600">(Optional)</span> */}
						</Body2>
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
