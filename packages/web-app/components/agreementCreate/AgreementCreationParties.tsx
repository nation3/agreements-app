// PartiesCard.tsx

import { AddIcon, Body2, Button, HeadlineBasic } from "@nation3/ui-components";
import { utils } from "ethers";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo } from "react";
import { useProvider } from "wagmi";
import { useTokenList } from "../../hooks/useTokenList";
import { validateCriteria } from "../../utils";
import { ParticipantRow } from "../ParticipantRow";
import { TokenSelector } from "../TokenSelector";
import { useAgreementCreation } from "./context/AgreementCreationContext";

interface PartiesCardProps {
	setActiveStep: (step: number) => void;
}

export const AgreementParties: React.FC<PartiesCardProps> = ({ setActiveStep }) => {
	const { t } = useTranslation("common");
	const { positions, token, setPositions, setToken, terms } = useAgreementCreation();
	const provider = useProvider({ chainId: 1 });
	const tokens = useTokenList();

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
			<div className="flex flex-col gap-base mt-base">
				<HeadlineBasic>{t("create.agreementPositions.title")}</HeadlineBasic>
				<div className="flex flex-col gap-min2">
					<Body2 className=" text-slate-500 text-md">
						{t("create.collateralToken.description")}
					</Body2>
					<div className="flex">
						<TokenSelector onTokenSelect={(selectedToken) => setToken(selectedToken)} />
					</div>
				</div>
				<div className="flex flex-col gap-min3">
					{positions.map((_, index) => (
						<div key={index}>
							<ParticipantRow
								ensProvider={provider}
								positions={positions}
								token={token}
								index={index}
								removePosition={() => setPositions(positions.filter((_, i) => i !== index))}
								onChange={setPositions}
							/>
						</div>
					))}
				</div>
				<div className="flex">
					<Button
						iconLeft={<AddIcon />}
						className="text-neutral-c-500"
						label="Add new participant"
						onClick={() =>
							setPositions([...positions, { account: "", balance: utils.parseUnits("0") }])
						}
					/>
				</div>
				{/* {!isValidCriteria && <InfoAlert message={t("create.agreementPositions.warning")} />} */}
				<div className="flex justify-between mt-base">
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
