import { ReactNode, useEffect, useState } from "react";
import { AgreementListContext } from "./AgreementListContext";
import { useQuery } from "@apollo/client";
import { useSigner } from "wagmi";
import { AgreementPositionsData, agreementsPositionsQuery } from "../../../lib/subgraph";

const useAgreementPositions = () => {
	const { data: signer } = useSigner();
	const [account, setAccount] = useState<string>("");

	const { data, error } = useQuery<AgreementPositionsData>(agreementsPositionsQuery, {
		variables: { account: account },
		skip: account ? false : true,
	});

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

	const [agreements, setAgreements] = useState(data?.agreementPositions);

	useEffect(() => {
		data?.agreementPositions &&
			setAgreements(
				data.agreementPositions.map((position) => {
					return {
						...position,
						agreement: {
							...position.agreement,
							title: localStorage.getItem(`agreement-${position.agreement.id}-title`) || undefined,
						},
					};
				}),
			);
	}, [data?.agreementPositions]);

	return { data: agreements, error };
};

export const AgreementListProvider = ({ children }: { children: ReactNode }) => {
	const { data: positions } = useAgreementPositions();

	const agreements =
		positions?.map(({ balance, agreement: { id, createdAt, status, title } }) => ({
			id,
			createdAt,
			userBalance: balance,
			status,
			title,
		})) || [];
	agreements.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

	const provider = {
		agreements,
	};

	return <AgreementListContext.Provider value={provider}>{children}</AgreementListContext.Provider>;
};
