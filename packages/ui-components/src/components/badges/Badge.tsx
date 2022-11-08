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

export const Badge = ({
	textColor = "white",
	bgColor = "black",
	className,
	...props
}: BadgeProps) => {
	return (
		<BadgeBase
			className={`font-normal text-${textColor} bg-${bgColor} ${className && className}`}
			{...props}
		/>
	);
};
