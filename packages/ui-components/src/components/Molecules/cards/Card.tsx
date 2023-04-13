import React, { HTMLAttributes, ReactNode } from "react";
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const Card = ({ children, className }: CardProps) => {
	return (
		<div
			className={`p-base md:p-double w-full bg-white rounded-lg border-2 border-neutral-c-200 ${className}`}
		>
			{children}
		</div>
	);
};
