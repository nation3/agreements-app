import { ReactNode, useEffect, useState } from "react";
import { AgreementListContext } from "./AgreementListContext";
import { AgreementListContextType } from "./AgreementListContext";
import { useAccount, useNetwork } from "wagmi";

const useUserAgreements = () => {
	const { chain } = useNetwork();
	const { address: account } = useAccount();
	const [error, setError] = useState<string>("");
	const [agreements, setAgreements] = useState<AgreementListContextType["agreements"]>([]);

	useEffect(() => {
		async function fetchAgreements() {
			try {
				const chainId = chain?.id || 1;
				const response = await fetch(`/api/${chainId}/agreements/${account}`);
				if (!response.ok) {
					setError(response.statusText);
				} else {
					const data = await response.json();
					if (data instanceof Array) {
						setAgreements(data);
					}
				}
			} catch (error) {
				setError("Error fetching agreements");
			}
		}
		if (account) {
			fetchAgreements();
		}
	}, [chain, account]);

	return { agreements, error };
};

export const AgreementListProvider = ({ children }: { children: ReactNode }) => {
	const { agreements } = useUserAgreements();

	agreements.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

	const provider = {
		agreements,
	};

	return <AgreementListContext.Provider value={provider}>{children}</AgreementListContext.Provider>;
};
