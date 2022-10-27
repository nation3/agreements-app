import { ReactNode, useState } from "react";
import { AgreementListContext } from "./AgreementListContext";
import { Agreement } from "./types";
import { ApolloProvider } from "@apollo/client";
import { client } from "../../../lib/subgraph";

export const AgreementListProvider = ({ children }: { children: ReactNode }) => {
	const [agreements, setAgreements] = useState<Agreement[]>([]);

	const provider = {
		agreements,
		setAgreements,
	};

	return (
		<ApolloProvider client={client}>
			<AgreementListContext.Provider value={provider}>{children}</AgreementListContext.Provider>
		</ApolloProvider>
	);
};
