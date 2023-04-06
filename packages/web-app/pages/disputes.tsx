import React from "react";
import { Card } from "@nation3/ui-components";
import { DisputeList, DisputeListProvider } from "../components/disputes-list";
import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/subgraph";
import { useConstants } from "../hooks/useConstants";
import { subgraphURI as defaultURI } from "../lib/constants";

const Disputes = () => {
	const { subgraphURI } = useConstants();

	return (
		<ApolloProvider client={client(subgraphURI ?? defaultURI ?? "")}>
			<DisputeListProvider>
				<article className=" w-full flex justify-center">
					<div className="absolute top h-60 w-full bg-pr-c-green1 z-1"></div>
					<div id="disputesPage" className="grid grid-cols-12 gap-24 z-10 mt-40">
						<Card className="col-start-1 col-end-10 flex flex-col w-full gap-24 text-gray-800">
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
		</ApolloProvider>
	);
};

export default Disputes;
