import { ReactElement } from "react";
import { useAgreementData } from "./context/AgreementDataContext";
import { AgreementFinalizedAlert, TermsVerificationAlert } from "../alerts";
import { JoinableAgreementActions } from "./actions/Joinable";
import { JoinedAgreementActions } from "./actions/Joined";
import { FinalizedAgreementActions } from "./actions/Finalized";

export const AgreementActions = (): ReactElement => {
	const { id, userPosition, status: agreementStatus } = useAgreementData();

	if (["Created", "Ongoing"].includes(String(agreementStatus))) {
		if (userPosition && userPosition.status == 0)
			return (
				<>
					<TermsVerificationAlert />
					<JoinableAgreementActions id={id} userPosition={userPosition} />
				</>
			);
		if (userPosition && userPosition.status == 1) return <JoinedAgreementActions id={id} />;
	} else if (String(agreementStatus) == "Finalized") {
		return (
			<>
				<AgreementFinalizedAlert />
				{userPosition && <FinalizedAgreementActions id={id} userPosition={userPosition} />}
			</>
		);
	}
	return <></>;
};
