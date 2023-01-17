import React, { HTMLAttributes, ReactNode } from "react";
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const Card = ({ children, className }: CardProps) => {
	return (
		<div className={`p-6 w-full md:max-w-3xl bg-white rounded-lg shadow-md ${className}`}>
			{children}
		</div>
	);
};
