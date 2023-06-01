import { Body3 } from "@nation3/ui-components";
import React from "react";

type IAgreementStatusProps = {
	fileStatus: "public" | "public-encrypted" | "private" | string;
};

const AgreementStatus: React.FC<IAgreementStatusProps> = ({ fileStatus }) => {
	return fileStatus.length > 0 ? (
		<div className="flex items-center gap-min2 cursor-default">
			<div className="border-2 border-neutral-c-200 w-auto rounded-base px-min2 h-full bg-white">
				<Body3 color="neutral-c-500" className="text-xs">
					{fileStatus}
				</Body3>
			</div>
		</div>
	) : (
		<></>
	);
};

export default AgreementStatus;
