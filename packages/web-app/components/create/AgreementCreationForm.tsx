import { ChangeEvent, useMemo, useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { Button, ButtonBase, IconButton, DropInput, InfoAlert, TextInput } from "@nation3/ui-components";
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

export const AgreementCreationForm = () => {
	const { t } = useTranslation("common");
	const provider = useProvider({ chainId: 1 });
	const tokens = useTokenList();
	const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
	const { title, terms, positions, id, token, changeView, setTitle, setTerms, setToken, setPositions } =
		useAgreementCreation();

	const defaultTitle = useMemo(() => `Agreement #${trimHash(id.toUpperCase())}`, [id]);

	const isValidCriteria = useMemo(() => validateCriteria(positions), [positions]);

	const isValidAgreement = useMemo(() => {
		if (!terms || !token) return false;
		return isValidCriteria;
	}, [terms, token, isValidCriteria]);

	return (
		<>
			<div className="text-gray-800">
				<h1 className="font-display font-medium text-2xl">{t("create.header")}</h1>
			</div>
			<div className="flex flex-col gap-4">
				<div>
					<h2 className="font-display font-medium text-xl">{t("create.agreementTerms.title")}</h2>
					<p>{t("create.agreementTerms.description")}</p>
					<GradientLink
						href="https://docs.nation3.org/agreements/creating-an-agreement"
						caption="Learn more"
					/>
				</div>
				<div className="flex flex-col gap-2">
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
				{!terms ? (
					<InfoAlert message={t("create.agreementTerms.warning")} />
				) : (
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
				)}
			</div>
			<hr />
			<div className="flex flex-col gap-4">
				<div>
					<h2 className="font-display font-medium text-xl">
						Token
					</h2>
				</div>
				<div>
					<button
						className="bg-gray-50 text-gray-800 text-sm rounded-lg block w-full p-2.5 border border-gray-200"
						onClick={() => setIsTokenModalOpen(true)}
					>
						{ token ? token.symbol : "Select token" }
					</button>
				</div>
				<div>
					<h2 className="font-display font-medium text-xl">
						{t("create.agreementPositions.title")}
					</h2>
					<p>{t("create.agreementPositions.description")}</p>
				</div>
				<div className="flex flex-col gap-2">
					{positions.map((_, index) => (
						<div key={index} className="flex items-center">
							<ParticipantRow
								ensProvider={provider}
								positions={positions}
								token={token?.symbol ?? "$"}
								index={index}
								onChange={setPositions}
							/>
							<div className="px-2">
								<IconButton
									icon={<MinusIcon className="w-6 h-6" />}
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
							icon={<PlusIcon className="w-6 h-6" />}
							rounded={true}
							onClick={() =>
								setPositions([...positions, { account: "", balance: utils.parseUnits("0") }])
							}
						/>
					</div>
				</div>
				{!isValidCriteria && <InfoAlert message={t("create.agreementPositions.warning")} />}
			</div>
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
			<Modal
				show={isTokenModalOpen}
				onClose={() => setIsTokenModalOpen(false)}
			>
				<Modal.Header>
					<h3 className="text-slate-600 md:text-xl text-xl font-semibold">
						{"Select Agreement Token"}		
					</h3>
				</Modal.Header>
				<Modal.Body>
					<div className="flex flex-col gap-2">
						{tokens.map((token) => {
							return (
								<ButtonBase
									key={token.address}
									className={"p-2 gap-1 border-2 font-semibold"}
									onClick={() => {
										setToken(token);
										setIsTokenModalOpen(false);
									}}
								>
									<>{token.name}</>
								</ButtonBase>
							);
						})
						}
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};
