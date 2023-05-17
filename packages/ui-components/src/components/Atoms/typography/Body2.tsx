import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
	color?: string;
}

export const Body2 = (props: Props) => {
	const { color, children, className } = props;
	return (
		<p
			{...props}
			className={`text-sm md:text-base tracking-wide text-${
				color ? color : "neutral-c-800"
			} ${className}`}
		>
			{children}
		</p>
	);
};
