import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { AgreementCreationProvider } from "../../../components/agreementCreate/context/AgreementCreationProvider";

import { GetStaticProps } from "next";
import Image from "next/image";
import { AgreementCreationLayout } from "../../../components/agreementCreate/AgreementCreationLayout";
import { AgreementTerms } from "../../../components/agreementCreate/AgreementCreationTerms";

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
				<div className="absolute top h-[350px] w-full bg-pr-c-green1 z-5">
					<Image src="/illustrations/header1.svg" fill object-fit="cover" alt={""} />
				</div>
				<AgreementCreationLayout>
					<AgreementTerms />
				</AgreementCreationLayout>
			</article>
		</AgreementCreationProvider>
	);
};

export default AgreementCreationPage;
