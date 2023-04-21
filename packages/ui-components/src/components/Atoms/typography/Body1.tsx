import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export const Body1 = (props: Props) => {
	return (
		<p {...props} className={`text-base md:text-lg font-medium tracking-wide ${props.className}`}>
			{props.children}
		</p>
	);
};
