import { BodyHeadline, Breadcrumbs, Card, Headline3 } from "@nation3/ui-components";
import { useMemo, useState } from "react";
import { useProvider } from "wagmi";
import { AgreementCreationPreview } from "./AgreementCreationPreview";

import { useAgreementCreation } from "./context/AgreementCreationContext";

import { useTranslation } from "next-i18next";
import { useTokenList } from "../../hooks/useTokenList";
import { trimHash, validateCriteria } from "../../utils";

import { Body3, IconRenderer, N3Agreement } from "@nation3/ui-components";
import cx from "classnames";
import AgreementCreateIntro from "./AgreementCreateIntro";
import { AgreementParties } from "./AgreementCreationParties";
import { AgreementTerms } from "./AgreementCreationTerms";

export const AgreementCreation = () => {
	const { view } = useAgreementCreation();
	const [activeStep, setActiveStep] = useState<number>(0);

	const { t } = useTranslation("common");
	const provider = useProvider({ chainId: 1 });
	const tokens = useTokenList();

	const { title, terms, positions, id, token, setToken } = useAgreementCreation();

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
					"grid grid-flow-row grid-cols-1 auto-rows-auto gap-base z-10 mt-40 m-base pb-double",
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
								"lg:col-start-1 lg:col-end-9 xl:col-end-10 lg:gap-16",
								"w-full text-gray-800",
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
								/>
							</div>
							{activeStep === 1 && <AgreementTerms setActiveStep={setActiveStep} />}
							{activeStep === 2 && <AgreementParties setActiveStep={setActiveStep} />}
							{activeStep === 3 && <AgreementCreationPreview />}
						</Card>

						{/* SIDE INFO */}
						<div className={cx("hidden md:block", "lg:col-start-9 xl:col-start-10 lg:col-end-13")}>
							<div className="w-full flex flex-col bg-white rounded-lg border-2 border-neutral-c-200">
								<div className="border-b-2 border-neutral-c-200 p-base">
									<IconRenderer
										className="mb-base"
										icon={<N3Agreement />}
										backgroundColor="pr-c-green1"
										size="sm"
										rounded
									/>
									<BodyHeadline className="text-neutral-c-400">Add agreement name</BodyHeadline>
								</div>
								<div className="p-base">
									<Body3 className="text-neutral-c-400 mb-min2">
										{/* {terms ? terms : "Add agreement terms"} */}
									</Body3>
									<Body3 className="text-neutral-c-400 mb-min2">
										{token ? token.symbol : "Select token for collateral"}
									</Body3>
									<Body3 className="text-neutral-c-400 mb-min2">
										{token ? token.symbol : "Select token for collateral"}
									</Body3>
								</div>
							</div>
						</div>
					</>
				)}
			</article>
		</>
	);
};
