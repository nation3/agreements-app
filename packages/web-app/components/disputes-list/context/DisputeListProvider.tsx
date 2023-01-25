import { ReactNode, useEffect, useState } from "react";
import { DisputeListContext } from "./DisputeListContext";
import { useQuery } from "@apollo/client";
import { useSigner } from "wagmi";
import { DisputesData, disputesQuery } from "../../../lib/subgraph";

const useDisputePositions = () => {
	const { data: signer } = useSigner();
	const [account, setAccount] = useState<string>("");

	const { data, error } = useQuery<DisputesData>(disputesQuery, {});

	useEffect(() => {
		if (signer) {
			signer.getAddress().then((address) => {
				if (address != account) setAccount(address);
			});
		} else {
			if (account) setAccount("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [signer]);

	return { data: data?.disputes, error };
};

export const DisputeListProvider = ({ children }: { children: ReactNode }) => {
	const { data: disputes } = useDisputePositions();

	const parsed =
		disputes
			?.map(({ id, createdAt, settlement }) => ({
				id,
				createdAt,
				status: settlement?.status ?? "Pending",
			}))
			.filter(({ status }) => status != "Executed") || [];
	parsed.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

	const provider = {
		disputes: parsed,
	};

	return <DisputeListContext.Provider value={provider}>{children}</DisputeListContext.Provider>;
};
