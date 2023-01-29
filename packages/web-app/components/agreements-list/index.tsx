// import { useEffect, useMemo } from 'react';
export { AgreementListProvider } from "./context/AgreementListProvider";
import Image from "next/image";

import { Table, utils, Badge, useScreen, ScreenType } from "@nation3/ui-components";
import { ethers, BigNumber } from "ethers";

import { useRouter } from "next/router";
import { useAgreementList } from "./context/AgreementListContext";
import { useTranslation } from "next-i18next";
import courtIll from "./../../public/court-ill.png";

export const AgreementList = () => {
	const { t } = useTranslation("common");
	const router = useRouter();
	const { screen } = useScreen();
	const { agreements } = useAgreementList();

	return (
		<>
			{agreements && agreements.length > 0 ? (
				<Table
					className={"max-h-full"}
					columns={
						screen === ScreenType.Desktop
							? ["Id", "Created on", "Your stake", "Status"]
							: ["Id", "Stake"]
					}
					data={agreements.map(({ id, createdAt, userBalance, status }) =>
						screen === ScreenType.Desktop
							? [
									<span key={id}>{utils.shortenHash(id)}</span>,
									<span key={`${id}-date`}>
										{new Date(Number(createdAt) * 1000).toLocaleDateString()}
									</span>,
									<b key={`${id}-position`}>
										{" "}
										{ethers.utils.formatUnits(BigNumber.from(userBalance))} $NATION{" "}
									</b>,
									<Badge key={`${id}-status`} label={status} bgColor="slate-300" />,
							  ]
							: [
									<span key={id}>{utils.shortenHash(id)}</span>,
									<b key={`${id}-position`}>
										{" "}
										{ethers.utils.formatUnits(BigNumber.from(userBalance))} $NATION{" "}
									</b>,
							  ],
					)}
					clickHandlers={agreements.map(
						({ id }) =>
							() =>
								router.push(`/agreement/${id}`),
					)}
				/>
			) : (
				<div className="flex justify-center w-full h-full">
					<div className="flex flex-col items-center w-full h-full">
						<div className="w-full flex items-center justify-center my-6">
							<Image
								className="w-28"
								src={courtIll}
								alt="GFG logo served with static path of public directory"
							/>
						</div>
						<div className="w-full flex justify-center flex-col items-center p-2">
							<p className="text-slate-400 font-medium text-xl md:w-1/2 tracking-wide text-center">
								{t("jurisdictionInfo")}
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
					</div>
				</div>
			)}
		</>
	);
};
