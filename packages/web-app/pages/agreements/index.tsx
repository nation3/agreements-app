import React from "react";
import { Card, Button } from "@nation3/ui-components";
import { useRouter } from "next/router";
import { AgreementList, AgreementListProvider } from "../../components/agreements-list";
import { ApolloProvider } from "@apollo/client";
import { client } from "../../lib/subgraph";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { GetStaticProps } from "next";
import { useConstants } from "../../hooks/useConstants";
import { subgraphURI as defaultURI } from "../../lib/constants";
import cx from "classnames";
import { Headline3 } from "@nation3/ui-components";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale as string, ["common"])),
			// Will be passed to the page component as props
		},
	};
};

const Agreements = () => {
	const router = useRouter();
	const { subgraphURI } = useConstants();

	return (
		<ApolloProvider client={client(subgraphURI ?? defaultURI ?? "")}>
			<AgreementListProvider>
				<article className="w-full flex justify-center">
					<div className="absolute top h-60 w-full bg-pr-c-green1 z-1"></div>
					<div
						id="agreementsPage"
						className={cx(
							"grid sm-only:grid-flow-row sm-only:grid-cols-1 sm-only:auto-rows-auto gap-24",
							"md:grid-cols-12 md:gap-24",
							"z-10 mt-40",
						)}
					>
						{/* <div className="col-start-1 col-end-12 h-40 bg-pr-c-green2"></div> */}
						<Card
							className={cx(
								"col-start-1 col-end-7 gap-16",
								"md:col-start-2 md:col-end-12 md:gap-24",
								"flex flex-col w-full text-gray-800",
							)}
						>
							<div className="md:flex items-center justify-between gap-2 text-gray-700">
								<Headline3 className="mb-base">My Agreements</Headline3>
								<div className="flex">
									<Button label="New Agreement" onClick={() => router.push("/agreements/create")} />
								</div>
							</div>
							<AgreementList />
						</Card>
					</div>
				</article>
			</AgreementListProvider>
		</ApolloProvider>
	);
};

export default Agreements;
