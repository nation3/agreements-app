import React, { ReactElement } from "react";
import { useAgreementData } from "./context/AgreementDataContext";
import { JoinableAgreementActions } from "./actions/Joinable";
import { JoinedAgreementActions } from "./actions/Joined";
import { FinalizedAgreementActions } from "./actions/Finalized";
import NoActions from "./actions/NoActions";

export const AgreementActions = (): ReactElement => {
	const { id, userPosition, status: agreementStatus } = useAgreementData();
	console.log("STATUS => ", agreementStatus);

	if (userPosition) {
		if (["Created", "Ongoing"].includes(String(agreementStatus))) {
			if (userPosition.status == 0)
				return <JoinableAgreementActions id={id} userPosition={userPosition} />;
			if (userPosition.status == 1 || userPosition.status == 2)
				return <JoinedAgreementActions id={id} />;
		} else if (String(agreementStatus) == "Finalized" && userPosition.status == 2) {
			return <FinalizedAgreementActions id={id} userPosition={userPosition} />;
		} else {
			return <NoActions />;
		}
	}
	return <></>;
};
