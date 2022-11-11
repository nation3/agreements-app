import { BigNumber } from "ethers";
import { ReactNode, useState } from "react";
import { AgreementCreationContext, AgreementCreationContextType } from "./AgreementCreationContext";
import { CreateView } from "./types";

export const AgreementCreationProvider = ({ children }: { children: ReactNode }) => {
	const [view, changeView] = useState(CreateView.Form);
	const [terms, setTerms] = useState("");
	const [positions, setPositions] = useState([
		{ account: "", balance: BigNumber.from(0) },
		{ account: "", balance: BigNumber.from(0) },
	]);

	const provider: AgreementCreationContextType = {
		view,
		terms,
		positions,
		changeView,
		setTerms,
		setPositions,
	};

	return (
		<AgreementCreationContext.Provider value={provider}>
			{children}
		</AgreementCreationContext.Provider>
	);
};
