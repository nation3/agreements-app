import { BigNumber } from "ethers";
import { ReactNode, useMemo, useState } from "react";
import { AgreementCreationContext, AgreementCreationContextType } from "./AgreementCreationContext";

import { useConstants } from "../../../hooks/useConstants";
import { abiEncoding, hashEncoding, hexHash } from "../../../utils";
import { CreateView, Token } from "./types";

export const AgreementCreationProvider = ({ children }: { children: ReactNode }) => {
	const [view, changeView] = useState(CreateView.Form);
	const [salt] = useState(hashEncoding(Date.now().toString()));
	const [title, setTitle] = useState("");
	const [terms, setTerms] = useState("");
	const [fileName, setFileName] = useState("");
	const [fileStatus, setFileStatus] = useState("private");
	const [filePass, setFilePass] = useState("");
	const [token, setToken] = useState<Token>({
		name: "Nation3",
		symbol: "NATION",
		address: "0x333A4823466879eeF910A04D473505da62142069",
		decimals: 18,
		icon: "/tokens/nation3.png",
	});
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
		token,
		termsHash,
		fileName,
		fileStatus,
		filePass,
		positions,
		id,
		changeView,
		setTitle,
		setTerms,
		setFileName,
		setFilePass,
		setFileStatus,
		setToken,
		setPositions,
	};

	return (
		<AgreementCreationContext.Provider value={provider}>
			{children}
		</AgreementCreationContext.Provider>
	);
};
