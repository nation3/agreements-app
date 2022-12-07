// import { useEffect, useMemo } from 'react';
export { AgreementListProvider } from "./context/AgreementListProvider";

import { Table, Badge } from "@nation3/ui-components";
import { ethers, BigNumber } from "ethers";

import { ScaleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useAgreementList } from "./context/AgreementListContext";

export const AgreementList = () => {
	const router = useRouter();
	const { agreements } = useAgreementList();

	return (
		<>
			{agreements && agreements.length > 0 ? (
				<Table
					className={"max-h-full"}
					columns={["Name", "Created on", "Your stake", "Status"]}
					data={agreements.map(({ title, id, createdAt, userBalance, status }) => [
						<span key={`${id}-${title}`}>{title}</span>,
						<span key={`${id}-date`}>
							{new Date(Number(createdAt) * 1000).toLocaleDateString()}
						</span>,
						<b key={`${id}-position`}>
							{" "}
							{ethers.utils.formatUnits(BigNumber.from(userBalance))} $NATION{" "}
						</b>,
						<Badge key={`${id}-status`} label={status} bgColor="slate-300" />,
					])}
					clickHandlers={agreements.map(
						({ id }) =>
							() =>
								router.push(`/agreements/${id}`),
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
