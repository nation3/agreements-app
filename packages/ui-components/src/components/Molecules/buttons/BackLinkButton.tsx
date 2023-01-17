import React, { HTMLAttributes } from "react";

import { ChevronLeftIcon } from "@heroicons/react/20/solid";

export interface BackLinkButtonProps extends HTMLAttributes<HTMLDivElement> {
	label?: string;
	color?: string;
	route: string;
	onRoute?: (route: string) => void;
}

export const BackLinkButton = ({
	route,
	label,
	color = "bluesky",
	onRoute,
	...props
}: BackLinkButtonProps) => {
	return (
		<div
			className={`flex items-center gap-1 py-1 text-${color} cursor-pointer hover:underline"`}
			onClick={() => onRoute?.(route)}
			{...props}
		>
			<ChevronLeftIcon className="w-4 h-4" />
			{label}
		</div>
	);
};

export default BackLinkButton;
