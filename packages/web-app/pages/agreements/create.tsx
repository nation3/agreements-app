import { useRouter } from "next/router";
import { AgreementCreationProvider } from "../../components/agreementCreate/context/AgreementCreationProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { GetStaticProps } from "next";
import Image from "next/image";
import { AgreementCreation } from "../../components/agreementCreate/AgreementCreation";

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
				<AgreementCreation />
			</article>
		</AgreementCreationProvider>
	);
};

export default AgreementCreationPage;
