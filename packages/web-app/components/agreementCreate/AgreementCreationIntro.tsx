import {
	Body1,
	Body3,
	BodyHeadline,
	Button,
	Card,
	IconRenderer,
	N3Agreement,
	N3User,
	N3World,
} from "@nation3/ui-components";
import React from "react";
import { GradientLink } from "../GradientLink";
import { i18n, useTranslation } from "next-i18next";

type IAgreementCreateIntroProps = {
	setActiveStep: (step: number) => void; // add setActiveStep as a prop
};

const IAgreementCreateIntroDefaultProps = {};

const AgreementCreateIntro = ({ setActiveStep }: IAgreementCreateIntroProps) => {
	const { t } = useTranslation("common");

	return (
		<>
			<Card className="md:p-double col-start-1 col-end-13 flex justify-center items-center relative">
				<div className="max-w-lg flex-col items-center justify-center flex gap-base">
					<IconRenderer
						className=""
						icon={<N3Agreement />}
						backgroundColor="pr-c-green1"
						size="sm"
						rounded
					/>
					<BodyHeadline>{t("newAgreement.heading")}</BodyHeadline>
					<Body3 className="text-center gap-y-min3">{t("newAgreement.subheading")}</Body3>
					<Button label="Create New Agreement" onClick={() => setActiveStep(1)}></Button>
				</div>
			</Card>
			<Card className="col-start-1 md:col-end-7 col-end-13" size="base">
				<IconRenderer
					className="mb-base"
					icon={<N3World />}
					backgroundColor="pr-c-green1"
					size="sm"
					rounded
				/>
				<Body1>{t("agreementIntro.heading")}</Body1>
				<Body3 className="text-neutral-c-600 my-min3">{t("agreementIntro.subheading")}</Body3>
				<GradientLink
					href={"https://docs.nation3.org/agreements/what-is-a-nation3-agreement"}
					caption={"Learn more"}
				></GradientLink>
			</Card>
			<Card className="col-start-1 md:col-start-7 col-end-13" size="base">
				<IconRenderer
					className="mb-base"
					icon={<N3User />}
					backgroundColor="pr-c-green1"
					size="sm"
					rounded
				/>
				<Body1>{t("agreementTips.heading")}</Body1>
				<Body3 className="text-neutral-c-600 my-min3">{t("agreementTips.subheading")}</Body3>
				<GradientLink
					href={"https://docs.nation3.org/agreements/creating-an-agreement"}
					caption={"Learn more"}
				></GradientLink>
			</Card>
		</>
	);
};

AgreementCreateIntro.defaultProps = IAgreementCreateIntroDefaultProps;

export default AgreementCreateIntro;
