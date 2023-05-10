import { ReactElement } from "react";
import { FinalizedAgreementActions } from "./actions/Finalized";
import { JoinableAgreementActions } from "./actions/Joinable";
import { JoinedAgreementActions } from "./actions/Joined";
import NoActions from "./actions/NoActions";
import { useAgreementData } from "./context/AgreementDataContext";

export const AgreementActions = (): ReactElement => {
	const { id, userPosition, status: agreementStatus } = useAgreementData();

	if (userPosition) {
		if (["Created", "Ongoing"].includes(String(agreementStatus))) {
			if (userPosition.status == "Pending")
				return <JoinableAgreementActions id={id} userPosition={userPosition} />;
			if (userPosition.status == "Joined" || userPosition.status == "Finalized")
				return <JoinedAgreementActions id={id} />;
		} else if (String(agreementStatus) == "Finalized" && userPosition.status == "Finalized") {
			return <FinalizedAgreementActions id={id} userPosition={userPosition} />;
		} else {
			return <NoActions />;
		}
	}
	return <NoActions />;
};
