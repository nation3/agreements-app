// import { useEffect, useMemo } from 'react';
export { DisputeListProvider } from "./context/DisputeListProvider";

import { Table, utils, Badge, ScreenType, useScreen } from "@nation3/ui-components";

import { useRouter } from "next/router";
import { useDisputeList } from "./context/DisputeListContext";
import Image from "next/image";
import courtIll from "../../public/court-ill.png";
import { GradientLink } from "../GradientLink";
import React from "react";

export const DisputeList = () => {
	const router = useRouter();
	const { disputes } = useDisputeList();
	const { screen } = useScreen();

	return (
		<>
			{disputes && disputes.length > 0 ? (
				<Table
					className={""}
					columns={
						screen === ScreenType.Desktop ? ["Id", "Created on", "Status"] : ["Id", "Status"]
					}
					data={disputes.map(({ id, createdAt, status }) =>
						screen === ScreenType.Desktop
							? [
									<span key={id}>{utils.shortenHash(id)}</span>,
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
					clickHandlers={disputes.map(
						({ id }) =>
							() =>
								router.push(`/dispute/${id}`),
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
								Nation3 has its own legal system, enforced by its own court and secured by economic
								incentives.
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
