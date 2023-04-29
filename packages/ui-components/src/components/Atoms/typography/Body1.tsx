import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
	color?: string;
}

export const Body1 = (props: Props) => {
	const { color, children, className } = props;
	return (
		<p
			{...props}
			className={`text-base md:text-lg font-medium tracking-wide text-${
				color ? color : "neutral-c-800"
			} ${className}`}
		>
			{children}
		</p>
	);
};
