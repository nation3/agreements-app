import { Body3, BodyHeadline, Button } from "@nation3/ui-components";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useConstants } from "../../../hooks/useConstants";
import { JoinModal } from "../../JoinModal";
import { useAgreementData } from "../context/AgreementDataContext";
import { UserPosition } from "../context/types";

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
			<section className="grid grid-cols-1 gap-6">
				{/* JOIN ACTION BLOCK */}
				<div className="w-full flex-col items-stretch h-full flex justify-between gap-min3">
					<div className="flex flex-col justify-between gap-min3">
						<div className="flex items-center">
							{/* <span>
								<CheckCircleIcon className="w-7 h-7 text-bluesky" />
							</span> */}
							<BodyHeadline color="neutral-c-800">{t("join.actions.header")}</BodyHeadline>
						</div>
						<Body3 color="neutral-c-500" className="text-sm ">
							{t("join.actions.description")}
						</Body3>
					</div>
					<Button
						outlined
						label={t("join.actions.header")}
						onClick={() => setIsJoinAgreementModalOpen(true)}
					/>
				</div>
			</section>

			<JoinModal
				onClose={() => setIsJoinAgreementModalOpen(false)}
				isOpen={isJoinAgreementModalOpen}
			/>
		</>
	);
};
