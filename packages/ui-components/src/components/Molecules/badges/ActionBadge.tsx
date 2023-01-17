import React, { ReactNode } from "react";
import { Tooltip } from "flowbite-react";

export interface ActionBadgeProps {
	label?: ReactNode;
	data?: ReactNode;
	icon?: ReactNode;
	tooltip?: boolean;
	tooltipProps?: any;
	textColor?: string;
	bgColor?: string;
	dataAction?: () => void;
	iconAction?: () => void;
}

export const ActionBadge = ({
	label,
	data,
	tooltip,
	tooltipProps,
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
				<button className={`bg-white px-2.5 rounded-md`} onClick={() => dataAction?.()}>
					{data}
				</button>
			)}
		</>
	);

	return (
		<span
			className={`flex w-fit items-center gap-2 px-1.5 py-1 rounded-lg text-${textColor} bg-${bgColor}`}
			{...props}
		>
			<span className="pl-1">{label}</span>
			{tooltip ? <Tooltip {...tooltipProps}>{body}</Tooltip> : body}
			{icon && <button onClick={() => iconAction?.()}>{icon}</button>}
		</span>
	);
};
