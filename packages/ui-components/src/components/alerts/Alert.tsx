import React, { ReactElement, ReactNode } from "react";

export interface AlertProps {
	message: string;
	color: string;
	children?: ReactNode;
	icon?: ReactElement;
	className?: string;
}

export const Alert = ({ message, icon, children, color, className }: AlertProps) => {
	return (
		<div
			className={`flex items-center justify-start max-w-full px-5 py-4 text-base font-normal rounded-2xl bg-${color} ${className}`}
		>
			{icon && <div className="pr-3">{icon}</div>}
			{message}
			{children && <div>{children}</div>}
		</div>
	);
};
