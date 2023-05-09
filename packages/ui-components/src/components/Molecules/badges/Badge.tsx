import React, { HTMLAttributes, ReactNode } from "react";
import { Body3 } from "../../Atoms";

export interface BadgeBaseProps extends HTMLAttributes<HTMLSpanElement> {
	label?: ReactNode;
}

export interface BadgeProps extends BadgeBaseProps {
	textColor?: string;
	bgColor?: string;
}

const BadgeBase = ({ label, className, ...props }: BadgeBaseProps) => {
	return (
		<Body3 className={`px-min2 py-min1 rounded-base ${className}`} {...props}>
			{label}
		</Body3>
	);
};

export const Badge = (props: BadgeProps) => {
	const { textColor = "neutral-c-300", bgColor = "white", className, ...args } = props;

	return (
		<BadgeBase
			className={`px-min2 border-2 border-neutral-c-200 rounded-base bg-white text-${textColor} bg-${bgColor} ${
				className && className
			}`}
			{...args}
		/>
	);
};
