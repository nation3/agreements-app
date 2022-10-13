import React, { HTMLAttributes, ReactNode } from "react";

export interface ActionBadgeProps extends HTMLAttributes<HTMLSpanElement> {
	label?: ReactNode;
	data?: ReactNode;
	icon?: ReactNode;
	textColor?: string;
	bgColor?: string;
	dataAction?: () => void;
	iconAction?: () => void;
}

export const ActionBadge = ({
	label,
	data,
	icon,
	textColor = "gray-700",
	bgColor = "gray-100",
	dataAction,
	iconAction,
	className,
	...props
}: ActionBadgeProps) => {
	return (
		<span
			className={`flex items-center gap-2 px-1.5 py-1 rounded-lg text-${textColor} bg-${bgColor} ${className}`}
			{...props}
		>
			<span className="pl-1">{label}</span>
			{data && (
				<button className={`bg-white px-2.5 rounded-md`} onClick={() => dataAction?.()}>
					{data}
				</button>
			)}
			{icon && <button onClick={() => iconAction?.()}>{icon}</button>}
		</span>
	);
};
