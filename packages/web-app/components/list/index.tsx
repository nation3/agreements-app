// import { useEffect, useMemo } from 'react';
export { AgreementListProvider } from "./context/AgreementListProvider";

import { Table, utils, Badge } from "@nation3/ui-components";
import { ScaleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useSigner } from "wagmi";
import { useEffect, useState } from "react";
import { AgreementPositionsData, agreementsPositionsQuery } from "../../lib/subgraph";

const useAgreementList = () => {
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

	const [agreements, setAgreements] = useState(data?.agreementPositions)

	useEffect(() => {
		data?.agreementPositions &&
			setAgreements(data.agreementPositions.map((position) => {
				return {
					...position,
					agreement: {
						...position.agreement,
						title: localStorage.getItem(`agreement-${position.agreement.id}-title`) || undefined
					}
				}
			}))
	}, [data?.agreementPositions])

	return { data: agreements, error };
};

export const AgreementList = () => {
	const router = useRouter();
	const { data: positions } = useAgreementList();

	return (
		<>
			{positions && positions.length > 0 ? (
				<Table
					columns={["Title", "ID", "Status"]}
					data={positions.map(({ agreement }) => [
						<p key={`${agreement.title}-${agreement.id}`} >
							{agreement.title}
						</p>,
						<a key={agreement.id} onClick={() => router.push(`/agreements/${agreement.id}`)}>
							{utils.shortenHash(agreement.id)}
						</a>,
						<Badge key={agreement.status} label={agreement.status} bgColor="slate-300" />,
					])}
					clickHandlers={positions.map(
						({ agreement }) =>
							() =>
								router.push(`/agreements/${agreement.id}`),
					)}
				/>
			) : (
				<div className="flex flex-col items-center justify-center w-full h-full">
					<div className="flex flex-row items-center justify-center gap-1 max-w-md h-min">
						<ScaleIcon className="w-64 text-slate-500" strokeWidth="1" />
						<div>
							<p className="text-justify">
								Nation3 has its own system of law, enforced by its own court and secured by economic
								incentives.
							</p>
							<a className="font-semibold bg-gradient-to-r from-bluesky to-greensea bg-clip-text text-transparent">
								Learn more →
							</a>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
