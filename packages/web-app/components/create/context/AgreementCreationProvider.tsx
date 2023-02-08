import { BigNumber } from "ethers";
import { ReactNode, useState, useMemo } from "react";
import { AgreementCreationContext, AgreementCreationContextType } from "./AgreementCreationContext";

import { hexHash, abiEncoding, hashEncoding } from "../../../utils";
import { CreateView } from "./types";
import { useConstants } from "../../../hooks/useConstants";

export const AgreementCreationProvider = ({ children }: { children: ReactNode }) => {
	const [view, changeView] = useState(CreateView.Form);
	const [salt] = useState(hashEncoding(Date.now().toString()));
	const [title, setTitle] = useState("");
	const [terms, setTerms] = useState("");
	const [positions, setPositions] = useState([
		{ account: "", balance: BigNumber.from(0) },
		{ account: "", balance: BigNumber.from(0) },
	]);
	const { frameworkAddress } = useConstants();

	const termsHash = useMemo(() => hexHash(terms), [terms]);

	const id = useMemo(() => {
		return hashEncoding(
			abiEncoding(["address", "bytes32", "bytes32"], [frameworkAddress, termsHash, salt]),
		);
	}, [termsHash, salt]);

	const provider: AgreementCreationContextType = {
		view,
		salt,
		title,
		terms,
		termsHash,
		positions,
		id,
		changeView,
		setTitle,
		setTerms,
		setPositions,
	};

	return (
		<AgreementCreationContext.Provider value={provider}>
			{children}
		</AgreementCreationContext.Provider>
	);
};
