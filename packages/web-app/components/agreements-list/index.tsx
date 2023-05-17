// import { useEffect, useMemo } from 'react';
export { AgreementListProvider } from "./context/AgreementListProvider";
import Image from "next/image";

import { Table, utils, Badge, useScreen, ScreenType } from "@nation3/ui-components";
import { ethers, BigNumber } from "ethers";

import { useRouter } from "next/router";
import { useAgreementList } from "./context/AgreementListContext";
import { useTranslation } from "next-i18next";
import courtIll from "./../../public/court-ill.png";
import { GradientLink } from "../GradientLink";
import React from "react";

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
						screen === ScreenType.Desktop ? ["Id", "Created on", "Status"] : ["Id", "Status"]
					}
					data={agreements.map(({ title, id, createdAt, status }) =>
						screen === ScreenType.Desktop
							? [
									<span key={id}>{title ? title : utils.shortenHash(id)}</span>,
									<span key={`${id}-date`}>
										{new Date(Number(createdAt) * 1000).toLocaleDateString()}
									</span>,
									<Badge key={`${id}-status`} label={status} bgColor="pr-c-blue2" />,
							  ]
							: [
									<span key={id}>{utils.shortenHash(id)}</span>,
									<Badge key={`${id}-status`} label={status} bgColor="pr-c-blue2" />,
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
								<GradientLink
									href="https://docs.nation3.org/jurisdiction/supreme-court"
									caption="Learn more"
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
