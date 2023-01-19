import { useAgreementCreation } from "./context/AgreementCreationContext";
import { CreateView } from "./context/types";
import { AgreementCreationForm } from "./AgreementCreationForm";
import { AgreementCreationPreview } from "./AgreementCreationPreview";

export const AgreementCreation = () => {
	const { view } = useAgreementCreation();

	switch (view) {
		case CreateView.Form:
			return <AgreementCreationForm />;
		case CreateView.Preview:
			return <AgreementCreationPreview />;
		default:
			return <></>;
	}
};
