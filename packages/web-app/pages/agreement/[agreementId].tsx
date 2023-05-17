import { useRouter } from "next/router";

import { AgreementDataProvider } from "../../components/agreement";
import { DisputeResolutionProvider } from "../../components/dispute";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { AgreementView } from "../../components/agreement/AgreementView";
import { useConstants } from "../../hooks/useConstants";

const AgreementPage = () => {
	const { frameworkAddress } = useConstants();
	const router = useRouter();
	const { query } = router;

	return (
		<AgreementDataProvider id={String(query.agreementId)}>
			<DisputeResolutionProvider framework={frameworkAddress} id={String(query.agreementId)}>
				<article className="w-full flex justify-center">
					<div className="absolute top h-[300px] w-full bg-pr-c-green1 z-5">
						<Image src="/illustrations/header1.svg" fill object-fit="cover" alt={""} />
					</div>

					<AgreementView />
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
