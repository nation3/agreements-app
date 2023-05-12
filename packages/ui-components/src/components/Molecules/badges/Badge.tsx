import React, { HTMLAttributes, ReactNode } from "react";

export interface BadgeBaseProps extends HTMLAttributes<HTMLSpanElement> {
	label?: ReactNode;
}

export interface BadgeProps extends BadgeBaseProps {
	textColor?: string;
	bgColor?: string;
}

const BadgeBase = ({ label, className, ...props }: BadgeBaseProps) => {
	return (
		<span
			className={`flex justify-center items-center px-min2 py-min1 rounded-base border-2 border-neutral-c-300 ${className}`}
			{...props}
		>
			{label}
		</span>
	);
};

export const Badge = (props: BadgeProps) => {
	const { textColor = "neutral-c-600", bgColor = "white", className, ...args } = props;

	return (
		<BadgeBase
			className={`text-xs text-${textColor} bg-${bgColor} ${className && className}`}
			{...args}
		/>
	);
};
