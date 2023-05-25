import type { ReactElement } from "react";
import { useRouter } from "next/router";

import { AgreementDataProvider } from "../../components/agreement";
import { DisputeResolutionProvider } from "../../components/dispute";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { AgreementView } from "../../components/agreement/AgreementView";
import { useConstants } from "../../hooks/useConstants";
import Layout from "../../components/layout/Layout";
import AgreementsLayout from "../../components/layout/agreements/Layout";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale as string, ["common"])),
			// Will be passed to the page component as props
		},
	};
};

const AgreementPage = () => {
	const { frameworkAddress } = useConstants();
	const router = useRouter();
	const { query } = router;

	return (
		<AgreementDataProvider id={String(query.agreementId)}>
			<DisputeResolutionProvider framework={frameworkAddress} id={String(query.agreementId)}>
				<AgreementView />
			</DisputeResolutionProvider>
		</AgreementDataProvider>
	);
};

// As recommended in https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#per-page-layouts
AgreementPage.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<AgreementsLayout>{page}</AgreementsLayout>
		</Layout>
	);
};

export default AgreementPage;
