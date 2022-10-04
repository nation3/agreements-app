import React from "react";
import { Card, BackLinkButton } from "@nation3/ui-components";
import { AgreementCreation, AgreementCreationProvider } from "../../components/create";
import { useRouter } from "next/router";

const AgreementCreationPage = () => {
    const router = useRouter()

	return (
		<div>
			<AgreementCreationProvider>
				<BackLinkButton route="/agreements" label="Go back to agreements" onRoute={router.push}/>
				<Card className="flex flex-col items-center items-stretch gap-8 w-full max-w-3xl text-gray-700">
					<AgreementCreation />
				</Card>
			</AgreementCreationProvider>
		</div>
	);
};

export default AgreementCreationPage;
