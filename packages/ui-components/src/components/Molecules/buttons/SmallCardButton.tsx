import React, { ReactNode } from "react";

export const SmallCardButton = ({
	children,
	className,
	onClick,
}: {
	children: ReactNode;
	className?: string;
	onClick?: () => void;
}) => (
	<div
		className={`flex gap-1 items-center justify-center bg-neutral-c-100 rounded-base cursor-pointer p-1 shadow-sm ${className}`}
		onClick={onClick}
	>
		{children}
	</div>
);
