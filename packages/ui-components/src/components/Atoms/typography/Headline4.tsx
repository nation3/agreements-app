import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export const Headline4 = (props: Props) => {
	return (
		<h4
			{...props}
			className={`text-lg md:text-3xl pb-min3 md:pb-base font-medium ${props.className}`}
		>
			{props.children}
		</h4>
	);
};
