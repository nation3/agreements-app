import { Card, Button } from "@nation3/ui-components";
import { useRouter } from "next/router";
import { AgreementList, AgreementListProvider } from "../../components/agreements-list";
import { ApolloProvider } from "@apollo/client";
import { client } from "../../lib/subgraph";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { GetStaticProps } from "next";
import { useConstants } from "../../hooks/useConstants";
import { subgraphURI as defaultURI } from "../../lib/constants";

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
				<article className=" w-full flex justify-center">
					<div className="absolute top h-60 w-full bg-pr-c-green1 z-1"></div>
					<div id="agreementsPage" className="grid grid-cols-12 gap-24 z-10 mt-40">
						{/* <div className="col-start-1 col-end-12 h-40 bg-pr-c-green2"></div> */}
						<Card className="col-start-1 col-end-12 flex flex-col w-full gap-24 text-gray-800">
							<div className="flex flex-row items-center justify-between gap-2 text-gray-700">
								<h1 className="pl-2 font-display font-medium text-xl md:text-3xl text-slate-600">
									Agreements
								</h1>
								<div className="flex gap-2 md:basis-1/3 basis-2/3">
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
