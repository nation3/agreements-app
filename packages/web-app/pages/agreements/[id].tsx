import { useRouter } from "next/router";
import { Card, BackLinkButton } from "@nation3/ui-components";

import {
	AgreementDetails,
	AgreementActions,
	AgreementDataProvider,
} from "../../components/agreement";

const AgreementPage = () => {
	const router = useRouter();
	const { query } = router;

	return (
		<div className="w-full max-w-2xl">
			<AgreementDataProvider id={String(query.id)}>
				<BackLinkButton
					route={"/agreements"}
					label={"Go back to agreements"}
					onRoute={router.push}
				/>
				<Card className="flex flex-col gap-8 w-full text-gray-800">
					<AgreementDetails />
					<AgreementActions />
				</Card>
			</AgreementDataProvider>
		</div>
	);
};

export default AgreementPage;
