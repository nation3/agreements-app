import { ReactNode, useState } from "react";
import { AgreementListContext } from "./AgreementListContext";
import { Agreement } from "./types";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

export const AgreementListProvider = ({ children }: { children: ReactNode }) => {
	const [agreements, setAgreements] = useState<Agreement[]>([]);

	const client = new ApolloClient({
		uri: process.env.NEXT_PUBLIC_GRAPH_API_URL,
		cache: new InMemoryCache(),
	});

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
