import { useState, useEffect, ReactElement } from "react";
import { useAccount } from "wagmi";
import { useAgreementData } from "./context/AgreementDataContext";
import { UserPosition } from "./context/types";
import { AgreementFinalizedAlert, TermsVerificationAlert } from "../alerts";
import { JoinableAgreementActions } from "./actions/Joinable";
import { JoinedAgreementActions } from "./actions/Joined";
import { FinalizedAgreementActions } from "./actions/Finalized";

export const AgreementActions = (): ReactElement => {
	const { address: userAddress } = useAccount();
	const { id, positions, resolvers, status: agreementStatus } = useAgreementData();
	const [userPosition, setUserPosition] = useState<UserPosition>();

	/* Update user position with agreement positions data */
	useEffect(() => {
		if (userAddress) {
			if (positions && positions[userAddress]) {
				setUserPosition((prevPosition) => ({ ...prevPosition, ...positions[userAddress] }));
			}
		} else {
			setUserPosition(undefined);
		}
	}, [userAddress, positions]);

	/* Update user position with agreement resolvers data */
	useEffect(() => {
		if (userAddress && resolvers && resolvers[userAddress]) {
			setUserPosition((prevPosition) => ({
				status: prevPosition?.status || 0,
				balance: prevPosition?.balance || resolvers[userAddress].balance,
				resolver: resolvers[userAddress],
			}));
		}
	}, [userAddress, resolvers]);

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
