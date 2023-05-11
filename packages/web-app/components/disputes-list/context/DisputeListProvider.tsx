import { ReactNode, useEffect, useState } from "react";
import { DisputeListContext, DisputeListContextType } from "./DisputeListContext";
import { useNetwork } from "wagmi";

const useDisputes = () => {
	const { chain } = useNetwork();
	const [error, setError] = useState<string>("");
	const [disputes, setDisputes] = useState<DisputeListContextType["disputes"]>([]);

	useEffect(() => {
		async function fetchDisputes() {
			try {
				const chainId = chain?.id || 1;
				const response = await fetch(`/api/${chainId}/disputes`);
				if (!response.ok) {
					setError(response.statusText);
				}
				const data = await response.json();
				setDisputes(data);
			} catch (error) {
				setError("Error fetching disputes");
			}
		}
		fetchDisputes();
	}, []);

	return { disputes, error };
};

export const DisputeListProvider = ({ children }: { children: ReactNode }) => {
	const { disputes } = useDisputes();

	const parsed = disputes.filter(({ status }) => status != "Executed") || [];
	parsed.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

	const provider = {
		disputes: parsed,
	};

	return <DisputeListContext.Provider value={provider}>{children}</DisputeListContext.Provider>;
};
