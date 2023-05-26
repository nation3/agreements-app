import { useRouter } from "next/router";
import { AgreementCreationProvider } from "../../components/agreementCreate/context/AgreementCreationProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { GetStaticProps } from "next";
import { AgreementCreation } from "../../components/agreementCreate/AgreementCreation";
import Layout from "../../components/layout/Layout";
import AgreementsLayout from "../../components/layout/agreements/Layout";
import { ReactElement } from "react";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale as string, ["common"])),
			// Will be passed to the page component as props
		},
	};
};

const AgreementCreationPage = () => {
	const router = useRouter();

	return (
		<AgreementsLayout>
			<AgreementCreationProvider>
				<AgreementCreation />
			</AgreementCreationProvider>
		</AgreementsLayout>
	);
};

// As recommended in https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#per-page-layouts
AgreementCreationPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<AgreementsLayout>{page}</AgreementsLayout>
		</Layout>
	);
};

export default AgreementCreationPage;
