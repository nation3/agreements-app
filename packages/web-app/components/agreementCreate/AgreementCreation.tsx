import { AgreementCreationPreview } from "./AgreementCreationPreview";
import { ChangeEvent, useMemo, useState } from "react";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
	Button,
	ButtonBase,
	IconButton,
	DropInput,
	InfoAlert,
	TextInput,
	Breadcrumbs,
	Card,
} from "@nation3/ui-components";
import { utils } from "ethers";
import { useProvider } from "wagmi";

import { useAgreementCreation } from "./context/AgreementCreationContext";
import { ParticipantRow } from "../ParticipantRow";
import { GradientLink } from "../GradientLink";
import { CreateView } from "./context/types";

import { validateCriteria, trimHash } from "../../utils";
import { useTranslation } from "next-i18next";
import { Modal } from "flowbite-react";
import { useTokenList } from "../../hooks/useTokenList";

import Image from "next/image";
import { useEffect } from "react";
import React from "react";
import { Body1 } from "@nation3/ui-components";
import { Headline4 } from "@nation3/ui-components";
import { Body3 } from "@nation3/ui-components";
import { Headline1 } from "@nation3/ui-components";
import { Headline2 } from "@nation3/ui-components";
import { Headline3, BodyHeadline } from "@nation3/ui-components";
import { AgreementActions } from "../agreement";
import { DisputeActions } from "../dispute";
import cx from "classnames";

export const AgreementCreation = () => {
	const { view } = useAgreementCreation();
	const [activeCard, setActiveStep] = useState<number>(0);

	const { t } = useTranslation("common");
	const provider = useProvider({ chainId: 1 });
	const tokens = useTokenList();
	const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
	const {
		title,
		terms,
		positions,
		id,
		token,
		changeView,
		setTitle,
		setTerms,
		setToken,
		setPositions,
	} = useAgreementCreation();

	const defaultTitle = useMemo(() => `Agreement #${trimHash(id.toUpperCase())}`, [id]);

	const isValidCriteria = useMemo(() => validateCriteria(positions), [positions]);

	const isValidAgreement = useMemo(() => {
		if (!terms || !token) return false;
		return isValidCriteria;
	}, [terms, token, isValidCriteria]);

	useEffect(() => {
		// Set default token
		setToken(tokens[0]);
	}, []);

	const termsCard = (
		<div className="grid grid-cols-12 gap-24">
			<section className={cx("lg:col-start-1 lg:col-end-10")}>
				<Card>
					<div className="text-gray-800">
						<h1 className="font-display font-medium text-2xl">{t("create.header")}</h1>
					</div>
					<div className="flex flex-col gap-4">
						<div>
							<h2 className="font-display font-medium text-xl">
								{t("create.agreementTerms.title")}
							</h2>
							<p>{t("create.agreementTerms.description")}</p>
							<GradientLink
								href="https://docs.nation3.org/agreements/creating-an-agreement"
								caption="Learn more"
							/>
						</div>
						<div className="flex flex-col gap-4">
							<div>
								<h3 className="flex gap-1 font-display">
									<span className="text-lg font-medium">{t("create.agreementTitle.title")}</span>
									<span className="text-md text-slate-600">(Optional)</span>
								</h3>
								<p>{t("create.agreementTitle.description")}</p>
							</div>
							<TextInput
								value={title}
								placeholder={defaultTitle}
								onChange={(e: ChangeEvent<HTMLInputElement>) => {
									setTitle(e.target.value);
								}}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Body3>Markdown file</Body3>
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
				</Card>
				<div className="flex justify-between">
					<Button label="Back" className="flex" onClick={() => setActiveStep(0)} />
					<Button label="Next" className="flex" onClick={() => setActiveStep(2)} />
				</div>
			</section>
			<div
				className={cx(
					// "sticky bottom-base",
					"lg:col-start-9 xl:col-start-10 lg:col-end-13",
				)}
			>
				<div className="w-full flex flex-col bg-white rounded-lg border-2 border-neutral-c-200">
					<div className="border-b-2 border-neutral-c-200 p-base">
						<BodyHeadline>Agreement Data</BodyHeadline>
					</div>
					<div className="p-base"></div>
				</div>
			</div>
		</div>
	);

	const partiesCard = (
		<Card>
			<div className="flex flex-col gap-4">
				<h2 className="font-display font-medium text-xl">{t("create.agreementPositions.title")}</h2>
				<div className="mb-4">
					<p className="mb-4 text-slate-500 text-md">{t("create.collateralToken.description")}</p>
					<div className="flex items-center">
						<button
							className="hover:bg-gray-100 hover:border-gray-400 transition-colors bg-gray-50 text-gray-800 text-sm rounded-lg block p-2.5 px-5 border border-gray-300 shadow-sm"
							onClick={() => setIsTokenModalOpen(true)}
						>
							Select token
						</button>
						{token && (
							<div className="ml-4 flex items-center">
								{token.icon && <Image height={20} width={20} alt={token.name} src={token.icon} />}
								<p className="ml-2 font-semibold text-slate-400">${token.symbol}</p>
							</div>
						)}
					</div>
				</div>
				<p className="text-slate-500 text-md">{t("create.agreementPositions.description")}</p>
				<div className="flex flex-col gap-2">
					<div className="flex items-center">
						<div className="basis-3/5 text-slate-400 text-sm">Addresses</div>
						<div className="basis-2/5 mr-8 text-slate-400 text-sm">
							{token && (
								<div className="flex items-center">
									<p className="mr-2 text-slate-400">${token.symbol}</p>
								</div>
							)}
						</div>
					</div>
					{positions.map((_, index) => (
						<div key={index} className="flex items-center">
							<ParticipantRow
								ensProvider={provider}
								positions={positions}
								token={token ? `${token.symbol}` : "$"}
								index={index}
								onChange={setPositions}
							/>
							<div className="px-2">
								<IconButton
									icon={<XCircleIcon className="w-6 h-6" />}
									rounded={true}
									bgColor="red"
									disabled={positions.length <= 2}
									onClick={() => setPositions(positions.filter((_, i) => i !== index))}
								/>
							</div>
						</div>
					))}
					<div className="flex justify-center">
						<IconButton
							icon={<PlusCircleIcon className="w-6 h-6" />}
							rounded={true}
							onClick={() =>
								setPositions([...positions, { account: "", balance: utils.parseUnits("0") }])
							}
						/>
					</div>
				</div>
				{!isValidCriteria && <InfoAlert message={t("create.agreementPositions.warning")} />}
			</div>
		</Card>
	);

	const introCard = (
		<>
			<div className="grid grid-cols-12 gap-24">
				<Card className="col-start-1 col-end-13 flex justify-center flex-col">
					<Body1>Nation3 Jurisdiction</Body1>
					<Headline4>Agreement</Headline4>
					<Body3>
						Lorem ipsum dolor sit amet consectetur. Cras feugiat tellus lorem nec rhoncus eu.
						Bibendum fringilla tincidunt viverra vestibulum justo fusce ultricies cras.
					</Body3>
					<Button label="Create Agreement" onClick={() => setActiveStep(1)}></Button>
				</Card>
				<Card className="col-start-1 col-end-7">
					<Body1>What is an agreement?</Body1>
					<Body3>
						Lorem ipsum dolor sit amet consectetur. Cras feugiat tellus lorem nec rhoncus eu. Lorem
						ipsum dolor sit amet consectetur. Cras feugiat tellus lorem nec rhoncus eu.
					</Body3>
					<Body1>Learn more</Body1>
				</Card>
				<Card className="col-start-7 col-end-13">
					<Body1>Quick tips for great agreements</Body1>
					<Body3>
						Lorem ipsum dolor sit amet consectetur. Cras feugiat tellus lorem nec rhoncus eu. Lorem
						ipsum dolor sit amet consectetur. Cras feugiat tellus lorem nec rhoncus eu.
					</Body3>
					<Body1>Learn more</Body1>
				</Card>
			</div>
		</>
	);

	return (
		<>
			<article id="agreementCreation" className="grid grid-cols-12 gap-base z-10 mt-40">
				<div className="col-start-1 col-end-13 flex flex-col w-full text-gray-800">
					<Headline3 className="font-semibold">Create Agreement</Headline3>
				</div>
				<div className="col-start-1 col-end-13 flex flex-col w-full text-gray-800">
					<Breadcrumbs
						steps={[
							{ title: "Intro", hidden: true },
							{ title: "Terms" },
							{ title: "Positions" },
							{ title: "Preview" },
						]}
						onStepChange={(index: number) => setActiveStep(index)}
					/>
				</div>
				<div className="col-start-1 col-end-13 flex flex-col w-full text-gray-800">
					{activeCard === 0 && introCard}
					{activeCard === 1 && termsCard}
					{activeCard === 2 && partiesCard}
					{activeCard === 3 && <AgreementCreationPreview />}
				</div>
			</article>
			<Modal show={isTokenModalOpen} onClose={() => setIsTokenModalOpen(false)}>
				<Modal.Header>
					<p className="text-slate-600">{"Select the collateral token"}</p>
				</Modal.Header>
				<Modal.Body>
					<div className="flex flex-col gap-2">
						{tokens.map((token) => {
							return (
								<ButtonBase
									key={token.address}
									className={
										"p-2 gap-1 border-2 font-semibold hover:bg-slate-50 transition-colors hover:border-bluesky-200"
									}
									onClick={() => {
										setToken(token);
										setIsTokenModalOpen(false);
									}}
								>
									<div className="flex items-center ">
										{token.icon && (
											<Image height={25} width={25} alt={token.name} src={token.icon} />
										)}
										<p className="ml-2">{token.name}</p>
									</div>
								</ButtonBase>
							);
						})}
					</div>
				</Modal.Body>
			</Modal>
		</>
	);

	return (
		<>
			<section id="agreement" className="grid grid-cols-12 gap-base z-10 mt-40">
				<div className="col-start-2 col-end-11 flex flex-col w-full text-gray-800">
					<div className="flex flex-col gap-2">
						<Button
							label="Create Agreement"
							disabled={!isValidAgreement}
							onClick={() => {
								setTitle(title || defaultTitle);
								changeView(CreateView.Preview);
							}}
						/>
					</div>
				</div>
			</section>
		</>
	);
};
