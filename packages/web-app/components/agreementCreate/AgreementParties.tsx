// PartiesCard.tsx

import { useAgreementCreation } from "./context/AgreementCreationContext";
import { ParticipantRow } from "../ParticipantRow";
import { useMemo, useState } from "react";
import { utils } from "ethers";
import { useTranslation } from "next-i18next";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { IconButton, InfoAlert } from "@nation3/ui-components";
import Image from "next/image";
import { useProvider } from "wagmi";
import { useTokenList } from "../../hooks/useTokenList";
import { ButtonBase, Button } from "@nation3/ui-components";
import { Modal } from "flowbite-react";
import { validateCriteria } from "../../utils";
import { CreateView } from "./context/types";

interface PartiesCardProps {
	setActiveStep: (step: number) => void;
	openTokenModal: (status: boolean) => void;
}

export const AgreementParties: React.FC<PartiesCardProps> = ({ setActiveStep, openTokenModal }) => {
	const { t } = useTranslation("common");
	const { positions, token, setPositions, setTitle, terms } = useAgreementCreation();
	const provider = useProvider({ chainId: 1 });
	const tokens = useTokenList();
	const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);

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
		</>
	);
};
