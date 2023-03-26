import { useState } from "react";
import { useAccount } from "wagmi";
import { UserPosition } from "../context/types";
import { Button } from "@nation3/ui-components";
import { useTranslation } from "next-i18next";
import { useConstants } from "../../../hooks/useConstants";
import { useAgreementData } from "../context/AgreementDataContext";
import { JoinModal } from "../../JoinModal";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

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
			<div className="grid grid-cols-2 gap-6">
				{/* JOIN ACTION BLOCK */}
				<div className="w-full flex-col items-stretch h-full flex justify-between">
					<div className="flex flex-col justify-between">
						<div className="flex mb-4 items-center">
							<span>
								<CheckCircleIcon className="w-7 h-7 text-bluesky" />
							</span>
							<h3 className="text-xl text-slate-700 ml-2 font-semibold">
								{t("join.actions.header")}
							</h3>
						</div>
						<p className="text-slate-500 text-sm mb-4">{t("join.actions.description")}</p>
					</div>
					<div>
						<Button
							className="flex w-auto px-10 rounded-full"
							outlined
							label={t("join.actions.header")}
							onClick={() => setIsJoinAgreementModalOpen(true)}
						/>
					</div>
				</div>
			</div>

			<JoinModal
				onClose={() => setIsJoinAgreementModalOpen(false)}
				isOpen={isJoinAgreementModalOpen}
			/>
		</>
	);
};
