import { useRouter } from "next/router";
import { Card, BackLinkButton } from "@nation3/ui-components";

import {
	AgreementDetails,
	AgreementActions,
	AgreementDataProvider,
} from "../../components/agreement";
import { DisputeResolutionProvider, DisputeActions } from "../../components/dispute";
import { frameworkAddress } from "../../lib/constants";

import { useAgreementData } from "../../components/agreement/context/AgreementDataContext";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps, GetStaticPaths } from "next";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale as string, ["common"])),
			// Will be passed to the page component as props
		},
	};
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
	return {
		paths: [], //indicates that no page needs be created at build time
		fallback: "blocking", //indicates the type of fallback
	};
};

const Agreement = () => {
	const { status } = useAgreementData();

	return (
		<>
			<AgreementDetails />
			{status == "Disputed" ? <DisputeActions /> : <AgreementActions />}
		</>
	);
};

const AgreementPage = () => {
	const router = useRouter();
	const { query } = router;

	return (
		<div className="w-full max-w-3xl">
			<AgreementDataProvider id={String(query.id)}>
				<DisputeResolutionProvider framework={frameworkAddress} id={String(query.id)}>
					<BackLinkButton
						route={"/agreements"}
						label={"Go back to agreements"}
						onRoute={router.push}
					/>
					<Card className="flex flex-col gap-8 w-full justify-center text-gray-800">
						<Agreement />
					</Card>
				</DisputeResolutionProvider>
			</AgreementDataProvider>
		</div>
	);
};

export default AgreementPage;
