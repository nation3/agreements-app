import { BigNumber } from "ethers";
import { ReactNode, useState } from "react";
import { AgreementCreationContext, AgreementCreationContextType } from "./AgreementCreationContext";
import { CreateView } from "./types";
import { hashEncoding } from "../../../utils/hash";

export const AgreementCreationProvider = ({ children }: { children: ReactNode }) => {
	const [view, changeView] = useState(CreateView.Form);
	const [terms, setTerms] = useState("");
	const [salt] = useState(hashEncoding(Date.now().toString()));
	const [positions, setPositions] = useState([
		{ account: "", balance: BigNumber.from(0) },
		{ account: "", balance: BigNumber.from(0) },
	]);

	const provider: AgreementCreationContextType = {
		view,
		salt,
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
