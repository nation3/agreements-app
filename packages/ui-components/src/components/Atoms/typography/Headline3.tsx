import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export const Headline3 = (props: Props) => {
	return (
		<h3 {...props} className={`text-3xl md:text-4xl font-bold ${props.className}`}>
			{props.children}
		</h3>
	);
};
