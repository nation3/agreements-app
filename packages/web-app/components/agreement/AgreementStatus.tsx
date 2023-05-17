import { Body3 } from "@nation3/ui-components";
import React from "react";

type IAgreementStatusProps = {
	fileStatus: "public" | "public-encrypted" | "private" | string;
};

const AgreementStatus: React.FC<IAgreementStatusProps> = ({ fileStatus }) => {
	const isEncrypted = fileStatus === "public-encrypted";

	const getStatusMessage = () => {
		switch (fileStatus) {
			case "public":
				return "Public";
			case "public-encrypted":
				return "Restricted";
			case "private":
				return "Private";
			default:
				return "";
		}
	};

	return fileStatus.length > 0 ? (
		<div className="flex items-center gap-min2 cursor-default">
			<div className="border-2 border-neutral-c-200 w-auto rounded-base px-min2 h-full bg-white">
				<Body3 color="neutral-c-500" className="text-xs">
					{getStatusMessage()}
				</Body3>
			</div>
		</div>
	) : (
		<></>
	);
};

export default AgreementStatus;
