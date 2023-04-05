import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export const Headline1 = (props: Props) => {
	return (
		<h1 {...props} className={`text-7xl md:text-8xl ${props.className}`}>
			{props.children}
		</h1>
	);
};
