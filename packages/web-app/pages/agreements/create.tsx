import React from "react";
import { Card, BackLinkButton } from "@nation3/ui-components";
import { AgreementCreation } from "../../components/create";
import { useRouter } from "next/router";
import { AgreementCreationProvider } from "../../components/create/context/AgreementCreationProvider";

const AgreementCreationPage = () => {
	const router = useRouter();

	return (
		<div className="w-full max-w-3xl">
			<AgreementCreationProvider>
				<BackLinkButton route="/agreements" label="Go back to agreements" onRoute={router.push} />
				<Card className="flex flex-col items-stretch gap-8 w-full text-gray-700 md:mb-20 mb-10">
					<AgreementCreation />
				</Card>
			</AgreementCreationProvider>
		</div>
	);
};

export default AgreementCreationPage;
