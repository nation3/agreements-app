import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	classname?: string;
}

export const Headline1 = (props: Props) => {
	return (
		<h1 {...props} className={`text-7xl md:text-8xl ${props.classname}`}>
			{props.children}
		</h1>
	);
};
