import { useState } from "react";
import { useAccount } from "wagmi";
import { UserPosition } from "../context/types";
import { Button } from "@nation3/ui-components";
import { useTranslation } from "next-i18next";
import { useConstants } from "../../../hooks/useConstants";
import { useAgreementData } from "../context/AgreementDataContext";
import { JoinModal } from "../../JoinModal";

export const JoinableAgreementActions = ({
	id,
	userPosition,
}: {
	id: string;
	userPosition: UserPosition;
}) => {
	const { frameworkAddress, NATION } = useConstants();
	const { t } = useTranslation("common");
	const { address } = useAccount();
	const { disputeCost: requiredDeposit, collateralToken, depositToken } = useAgreementData();
	const [isJoinAgreementModalOpen, setIsJoinAgreementModalOpen] = useState<boolean>(false);

	return (
		<>
			<div className="flex flex-col gap-1">
				<Button label="Join Agreement" onClick={() => setIsJoinAgreementModalOpen(true)} />
			</div>
			<JoinModal
				onClose={() => setIsJoinAgreementModalOpen(false)}
				isOpen={isJoinAgreementModalOpen}
			/>
		</>
	);
};
