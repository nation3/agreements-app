import React, { ReactElement } from "react";
import { Card, Button, Headline3 } from "@nation3/ui-components";
import { useRouter } from "next/router";
import { AgreementList, AgreementListProvider } from "../components/agreements-list";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../components/layout/Layout";
import AgreementsLayout from "../components/layout/agreements/Layout";
import AgreementsGrid from "../components/layout/agreements/Grid";

import { GetStaticProps } from "next";
import { useConstants } from "../hooks/useConstants";
import cx from "classnames";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale as string, ["common"])),
			// Will be passed to the page component as props
		},
	};
};

const AgreementsPage = () => {
	const router = useRouter();
	const { subgraphURI } = useConstants();

	return (
		<AgreementListProvider>
			<AgreementsGrid id="agreementsList">
				<div className="col-start-1 col-end-13 w-full flex flex-col lg:flex-row justify-between text-gray-800">
					<Headline3 className="pb-0">My Agreements</Headline3>
					<Button
						className="hidden md:inline"
						label="New Agreement"
						onClick={() => router.push("/agreement/create")}
					/>
				</div>
				<Card
					className={cx(
						"col-start-1 col-end-13",
						"lg:gap-16",
						"w-full text-gray-800 transition-all",
					)}
				>
					<AgreementList />
				</Card>
			</AgreementsGrid>
		</AgreementListProvider>
	);
};

AgreementsPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<AgreementsLayout>{page}</AgreementsLayout>
		</Layout>
	);
};

export default AgreementsPage;
