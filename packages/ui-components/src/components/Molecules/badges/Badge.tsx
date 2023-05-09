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
		<span className={`px-min2 py-min1 text-sm rounded-base ${className}`} {...props}>
			{label}
		</span>
	);
};

export const Badge = (props: BadgeProps) => {
	const { textColor = "neutral-c-500", bgColor = "white", className, ...args } = props;

	return (
		<BadgeBase
			className={`px-min2 border-2 border-neutral-c-300 rounded-base text-${textColor} bg-${bgColor} ${
				className && className
			}`}
			{...args}
		/>
	);
};
