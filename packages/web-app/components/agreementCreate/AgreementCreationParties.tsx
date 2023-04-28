// PartiesCard.tsx

import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Button, ButtonBase, IconButton, InfoAlert } from "@nation3/ui-components";
import { utils } from "ethers";
import { Modal } from "flowbite-react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useProvider } from "wagmi";
import { useTokenList } from "../../hooks/useTokenList";
import { validateCriteria } from "../../utils";
import { ParticipantRow } from "../ParticipantRow";
import { useAgreementCreation } from "./context/AgreementCreationContext";

interface PartiesCardProps {
	setActiveStep: (step: number) => void;
}

export const AgreementParties: React.FC<PartiesCardProps> = ({ setActiveStep }) => {
	const { t } = useTranslation("common");
	const { positions, token, setPositions, setToken, terms } = useAgreementCreation();
	const provider = useProvider({ chainId: 1 });
	const tokens = useTokenList();
	const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);

	const openTokenModal = (state: boolean) => {
		setIsTokenModalOpen(state);
	};

	useEffect(() => {
		// Set default token
		setToken(tokens[0]);
	}, []);
	const isValidCriteria = useMemo(() => validateCriteria(positions), [positions]);

	const isValidAgreement = useMemo(() => {
		if (!terms || !token) return false;
		return isValidCriteria;
	}, [terms, token, isValidCriteria]);

	return (
		<>
			<div className="flex flex-col gap-4">
				<h2 className="font-display font-medium text-xl">{t("create.agreementPositions.title")}</h2>
				<div className="mb-4">
					<p className="mb-4 text-slate-500 text-md">{t("create.collateralToken.description")}</p>
					<div className="flex items-center">
						<Button label="Select token" onClick={() => setIsTokenModalOpen(true)} />
						{token && (
							<div className="ml-4 flex items-center">
								{token.icon && <Image height={20} width={20} alt={token.name} src={token.icon} />}
								<p className="ml-2 font-semibold text-slate-400">${token.symbol}</p>
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-col gap-2">
					{positions.map((_, index) => (
						<div key={index} className="flex items-center">
							<ParticipantRow
								ensProvider={provider}
								positions={positions}
								token={token ? `${token.symbol}` : "$"}
								index={index}
								removePosition={() => setPositions(positions.filter((_, i) => i !== index))}
								onChange={setPositions}
							/>
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
				<div className="flex justify-between">
					<Button label="Back" onClick={() => setActiveStep(1)} />
					<Button
						disabled={!isValidAgreement}
						label="Next"
						onClick={() => {
							setActiveStep(3);
						}}
					/>
				</div>
			</div>
			{/* MODAL */}
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
};
