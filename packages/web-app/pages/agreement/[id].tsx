import React from "react";
import { useRouter } from "next/router";
import { Card, BackLinkButton } from "@nation3/ui-components";

import { Agreement, AgreementActions, AgreementDataProvider } from "../../components/agreement";
import { DisputeResolutionProvider, DisputeActions } from "../../components/dispute";

import { useAgreementData } from "../../components/agreement/context/AgreementDataContext";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { useConstants } from "../../hooks/useConstants";
import Image from "next/image";

const AgreementPage = () => {
	const { frameworkAddress } = useConstants();
	const router = useRouter();
	const { query } = router;

	return (
		<AgreementDataProvider id={String(query.id)}>
			<DisputeResolutionProvider framework={frameworkAddress} id={String(query.id)}>
				<article className="w-full flex justify-center">
					<div className="absolute top h-[300px] w-full bg-pr-c-green1 z-5">
						<Image src="/illustrations/header1.svg" fill object-fit="cover" alt={""} />
					</div>

					<Agreement />
				</article>
			</DisputeResolutionProvider>
		</AgreementDataProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale as string, ["common"])),
			// Will be passed to the page component as props
		},
	};
};

export default AgreementPage;
