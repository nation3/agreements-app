// import { useEffect, useMemo } from 'react';
export { AgreementListProvider } from "./context/AgreementListProvider";
import Image from "next/image";

import { Table, utils, Badge } from "@nation3/ui-components";
import { ethers, BigNumber } from "ethers";

import { ScaleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useAgreementList } from "./context/AgreementListContext";
import courtIll from "./../../public/court-ill.png";

export const AgreementList = () => {
	const router = useRouter();
	const { agreements } = useAgreementList();

	return (
		<>
			{agreements && agreements.length > 0 ? (
				<Table
					className={"max-h-full"}
					columns={["Id", "Created on", "Your stake", "Status"]}
					data={agreements.map(({ id, createdAt, userBalance, status }) => [
						<span key={id}>{utils.shortenHash(id)}</span>,
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
				<div className="flex justify-center w-full h-full">
					<div className="flex items-center justify-center w-full h-full">
						<div className="w-full p-2 pl-6 pb-16 ">
							<p className=" text-slate-500 font-medium text-2xl w-4/5 tracking-wide">
								Nation3 has its own system of law, enforced by its own court and secured by economic
								incentives.
							</p>
							<div className="mt-3">
								<a
									className="group font-semibold bg-gradient-to-r from-bluesky to-greensea bg-clip-text text-transparent cursor-pointer"
									href="https://docs.nation3.org/jurisdiction/supreme-court"
								>
									Learn more <span className="group-hover:ml-1 transition-all">→</span>
								</a>
							</div>
						</div>
						<div className="w-full flex items-center justify-center">
							<Image
								className="w-2/3"
								src={courtIll}
								alt="GFG logo served with static path of public directory"
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
