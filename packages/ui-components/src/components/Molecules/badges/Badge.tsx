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
		<span className={`px-2.5 py-0.5 rounded-md ${className}`} {...props}>
			{label}
		</span>
	);
};

export const Badge = (props: BadgeProps) => {
	const { textColor = "neutral-c-600", bgColor = "black", className, ...args } = props;

	return (
		<BadgeBase
			className={`px-4 font-normal text-${textColor} bg-${bgColor} ${className && className}`}
			{...args}
		/>
	);
};
