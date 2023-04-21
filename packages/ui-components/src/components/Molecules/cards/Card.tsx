import React, { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	size?: "base" | "double";
}

export const Card = (props: CardProps) => {
	const { children, className, size } = props;
	return (
		<div
			className={`p-${
				size ? size : "base"
			} w-full bg-white rounded-lg border-2 border-neutral-c-200 ${className}`}
		>
			{children}
		</div>
	);
};
