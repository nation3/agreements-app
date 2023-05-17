// AgreementCreationParties.tsx

import {
	AddIcon,
	Body2,
	Button,
	HeadlineBasic,
	IconRenderer,
	InfoAlert,
	Body3,
} from "@nation3/ui-components";
import { utils } from "ethers";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useProvider } from "wagmi";
import { useTokenList } from "../../hooks/useTokenList";
import { validateCriteria } from "../../utils";
import { ParticipantRow } from "../ParticipantRow";
import { TokenSelector } from "../TokenSelector";
import { useAgreementCreation } from "./context/AgreementCreationContext";
import { InputPositionList, Token } from "./context/types";

interface PartiesCardProps {
	setActiveStep: (step: number) => void;
}

export const AgreementParties: React.FC<PartiesCardProps> = ({ setActiveStep }) => {
	const { t } = useTranslation("common");
	const { positions, token, setPositions, setToken, terms } = useAgreementCreation();
	const provider = useProvider({ chainId: 1 });
	const tokens = useTokenList();
	const [selectedToken, setSelectedToken] = useState<Token>();
	const [localPositions, setlocalPositions] = useState<InputPositionList>(positions);

	useEffect(() => {
		if (tokens.length > 0) {
			setSelectedToken(tokens[0]);
			setToken(tokens[0]);
		}
	}, [tokens, setToken]);

	// Update token on select
	useEffect(() => {
		setSelectedToken(token);
		setToken(token);
	}, [token]);

	useEffect(() => {
		positions && setlocalPositions(positions);
	}, [positions]);

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
					<div className="flex items-center gap-base">
						<TokenSelector onTokenSelect={(selectedToken) => setToken(selectedToken)} />
						<div className="flex gap-min2 shadow rounded-base pr-min2 items-center">
							{selectedToken?.icon && (
								<>
									<IconRenderer
										size={"xs"}
										backgroundColor={"pr-c-green1"}
										icon={
											<Image height={20} width={20} alt={token.name} src={selectedToken?.icon} />
										}
									/>
								</>
							)}

							<Body3 className="text-xs">
								{"$"}
								{selectedToken?.symbol}
							</Body3>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-min3">
					{localPositions.map((_, index) => (
						<div key={index}>
							<ParticipantRow
								ensProvider={provider}
								positions={localPositions}
								token={token}
								index={index}
								removePosition={() => setPositions(positions.filter((_, i) => i !== index))}
								onChange={setPositions}
							/>
						</div>
					))}
				</div>
				<div className="flex flex-wrap justify-between gap-min3">
					{!isValidCriteria && (
						<InfoAlert
							className="rounded-md text-sm flex"
							message={t("create.agreementPositions.warning")}
						/>
					)}
					<Button
						iconLeft={<AddIcon />}
						className="text-neutral-c-500"
						label="Add new participant"
						onClick={() =>
							setPositions([...positions, { account: "", balance: utils.parseUnits("0") }])
						}
					/>
				</div>
				<div className="flex justify-end"></div>
				<div className="flex justify-between gap-min3">
					<Button label="Back" onClick={() => setActiveStep(1)} />
					<div className="flex gap-min3 items-center justify-end w-full">
						<Button
							disabled={!isValidAgreement}
							label="Next"
							onClick={() => {
								setActiveStep(3);
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
