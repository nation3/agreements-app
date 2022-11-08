import React from "react";

import { InformationCircleIcon } from "@heroicons/react/24/outline";

import { Alert, AlertProps } from "./Alert";

export interface InfoAlertProps extends Omit<AlertProps, "color"> {
	color?: string;
}

export const InfoAlert = ({ className, color = "bluesky", ...props }: InfoAlertProps) => {
	return (
		<Alert
			color={`${color}-200`}
			className={`bg-opacity-20 text-${color}-500 ${className && className}`}
			icon={<InformationCircleIcon className="w-5 h-5" />}
			{...props}
		/>
	);
};
