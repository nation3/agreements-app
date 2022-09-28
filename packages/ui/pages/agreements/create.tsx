import React from "react";
import { Card } from "@nation3/components";
import { BackLinkButton } from "../../components/buttons";
import { AgreementCreationProvider } from "../../components/Create/context/AgreementCreationProvider";
import { Create } from "../../components/Create";

const AgreementCreation = () => {
	return (
		<div>
			<AgreementCreationProvider>
				<BackLinkButton route="/agreements" />
				<Card className="flex flex-col items-center items-stretch gap-8 w-screen max-w-3xl text-gray-700">
					<Create />
				</Card>
			</AgreementCreationProvider>
		</div>
	);
};

export default AgreementCreation;
