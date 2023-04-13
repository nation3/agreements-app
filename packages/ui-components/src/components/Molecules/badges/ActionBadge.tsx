import React, { ReactNode } from "react";
import { Tooltip } from "flowbite-react";

export interface ActionBadgeProps {
	label?: ReactNode;
	data?: ReactNode;
	icon?: ReactNode;
	tooltip?: boolean;
	tooltipContent?: string;
	textColor?: string;
	bgColor?: string;
	dataAction?: () => void;
	iconAction?: () => void;
}

export const ActionBadge = ({
	label,
	data,
	tooltip,
	tooltipContent,
	icon,
	textColor = "gray-700",
	bgColor = "gray-100",
	dataAction,
	iconAction,
	...props
}: ActionBadgeProps) => {
	const body = (
		<>
			{data && (
				<button className={`bg-white px-min2 my-min1 rounded-md`} onClick={() => dataAction?.()}>
					{data}
				</button>
			)}
		</>
	);

	return (
		<span
			className={`flex w-fit items-center gap-2  px-min2 py-min1 md:px-min3 md:py-min2 rounded-lg text-${textColor} bg-${bgColor}`}
			{...props}
		>
			<span className="pl-1">{label}</span>
			{tooltip ? (
				<Tooltip style="light" animation="duration-150" content={tooltipContent}>
					{body}
				</Tooltip>
			) : (
				body
			)}
			{icon && <button onClick={() => iconAction?.()}>{icon}</button>}
		</span>
	);
};
