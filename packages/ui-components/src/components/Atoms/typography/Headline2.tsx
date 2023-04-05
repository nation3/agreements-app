import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export const Headline2 = (props: Props) => {
	return (
		<h2 {...props} className={`text-5xl md:text-7xl pb-base ${props.className}`}>
			{props.children}
		</h2>
	);
};
