import { useRouter } from "next/router";
import { Card, BackLinkButton } from "@nation3/ui-components";

import {
	AgreementDetails,
	AgreementActions,
	AgreementDataProvider,
} from "../../components/agreement";
import { DisputeResolutionProvider, DisputeActions } from "../../components/dispute";

import { useAgreementData } from "../../components/agreement/context/AgreementDataContext";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { useConstants } from "../../hooks/useConstants";

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
	const { frameworkAddress } = useConstants();
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale as string, ["common"])),
			// Will be passed to the page component as props
		},
	};
};

export default AgreementPage;
