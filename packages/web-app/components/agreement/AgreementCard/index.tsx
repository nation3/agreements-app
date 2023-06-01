import React from "react";
import AgreementCardCompact, { AgreementCardCompactProps } from "./AgreementCardCompact";
import AgreementCardPreview, { AgreementCardPreviewProps } from "./AgreementCardPreview";

type AgreementCardProps =
	| ({ variant: "compact" } & AgreementCardCompactProps)
	| ({ variant?: "preview" } & AgreementCardPreviewProps);

const AgreementCard: React.FC<AgreementCardProps> = (props) => {
	const { variant = "preview" } = props;

	if (variant === "compact") {
		return <AgreementCardCompact {...(props as AgreementCardCompactProps)} />;
	} else {
		return <AgreementCardPreview {...(props as AgreementCardPreviewProps)} />;
	}
};

export { AgreementCardCompact, AgreementCardPreview };
export default AgreementCard;
