import { Breadcrumbs, Card, Headline3 } from "@nation3/ui-components";
import { useMemo, useState } from "react";
import { useProvider } from "wagmi";
import { AgreementCreationPreview } from "./AgreementCreationPreview";

import { useAgreementCreation } from "./context/AgreementCreationContext";

import { useTranslation } from "next-i18next";
import { useTokenList } from "../../hooks/useTokenList";
import { trimHash, validateCriteria } from "../../utils";

import cx from "classnames";
import AgreementCreateIntro from "./AgreementCreateIntro";
import { AgreementParties } from "./AgreementCreationParties";
import { AgreementTerms } from "./AgreementCreationTerms";
import AgreementPreview from "./AgreementPreview";

export const AgreementCreation = () => {
	const { view } = useAgreementCreation();
	const [activeStep, setActiveStep] = useState<number>(0);

	const { t } = useTranslation("common");
	const provider = useProvider({ chainId: 1 });
	const tokens = useTokenList();

	const { title, terms, positions, id, token, setToken, termsHash, fileName } =
		useAgreementCreation();

	const defaultTitle = useMemo(() => `Agreement #${trimHash(id.toUpperCase())}`, [id]);

	const isValidCriteria = useMemo(() => validateCriteria(positions), [positions]);

	const isValidAgreement = useMemo(() => {
		if (!terms || !token) return false;
		return isValidCriteria;
	}, [terms, token, isValidCriteria]);

	return (
		<>
			<article
				id="agreementCreation"
				className={cx(
					"grid grid-flow-row grid-cols-1 md:w-auto w-full auto-rows-auto gap-base z-10 mt-40 m-base pb-double",
					"lg:grid-cols-lg lg:gap-24",
					"xl:grid-cols-xl",
				)}
			>
				<div className="col-start-1 col-end-13 flex flex-col w-full text-gray-800">
					<Headline3 className="font-semibold">Create Agreement</Headline3>
				</div>

				{/* INTRO */}
				{activeStep === 0 && <AgreementCreateIntro setActiveStep={setActiveStep} />}

				{/* STEPS  */}
				{activeStep !== 0 && (
					<>
						<Card
							className={cx(
								"col-start-1 col-end-13",
								"lg:col-start-1 lg:gap-16",
								activeStep !== 3 ? "lg:col-end-9 xl:col-end-10" : "lg:col-end-13",
								"w-full text-gray-800 transition-all",
							)}
						>
							<div className="mb-min2">
								<Breadcrumbs
									steps={[
										{ title: "Intro", hidden: true },
										{ title: "Name & Terms" },
										{ title: "Positions" },
										{ title: "Preview" },
									]}
									hidden={activeStep === 0}
									onStepChange={(index: number) => setActiveStep(index)}
									activeStep={activeStep}
								/>
							</div>
							{activeStep === 1 && <AgreementTerms setActiveStep={setActiveStep} />}
							{activeStep === 2 && <AgreementParties setActiveStep={setActiveStep} />}
							{activeStep === 3 && <AgreementCreationPreview setActiveStep={setActiveStep} />}
						</Card>
						{activeStep !== 3 && <AgreementPreview />}
					</>
				)}
			</article>
		</>
	);
};
