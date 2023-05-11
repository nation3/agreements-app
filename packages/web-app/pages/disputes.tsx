import React from "react";
import { Card } from "@nation3/ui-components";
import { DisputeList, DisputeListProvider } from "../components/disputes-list";
import { useConstants } from "../hooks/useConstants";
import cx from "classnames";

const Disputes = () => {
	const { subgraphURI } = useConstants();

	return (
		<DisputeListProvider>
			<article className=" w-full flex justify-center">
				<div className="absolute top h-60 w-full bg-pr-c-green1 z-1"></div>
				<div
					id="disputesPage"
					className={cx(
						"grid sm-only:grid-flow-row sm-only:grid-cols-1 sm-only:auto-rows-auto gap-24",
						"md:grid-cols-12 md:gap-24",
						"z-10 mt-40",
					)}
				>
					<Card
						className={cx(
							"col-start-1 col-end-7 gap-16",
							"md:col-start-2 md:col-end-12 md:gap-24",
							"flex flex-col w-full text-gray-800",
						)}
					>
						<div className="flex flex-row items-center justify-between gap-2 text-gray-700">
							<h1 className="pl-2 font-display font-medium text-xl md:text-3xl text-slate-600">
								Open Disputes
							</h1>
						</div>
						<DisputeList />
					</Card>
				</div>
			</article>
		</DisputeListProvider>
	);
};

export default Disputes;
