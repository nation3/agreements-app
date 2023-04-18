import React from "react";
import { Card, BackLinkButton } from "@nation3/ui-components";
import { AgreementCreation } from "../../components/create";
import { useRouter } from "next/router";
import { AgreementCreationProvider } from "../../components/create/context/AgreementCreationProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { GetStaticProps } from "next";

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
		<AgreementCreationProvider>
			{/* <BackLinkButton route="/agreements" label="Go back to agreements" onRoute={router.push} /> */}
			<article className="w-full flex justify-center">
				<div className="absolute top h-[300px] w-full bg-pr-c-green1 z-5"></div>
				<AgreementCreation />
			</article>
		</AgreementCreationProvider>
	);
};

export default AgreementCreationPage;
