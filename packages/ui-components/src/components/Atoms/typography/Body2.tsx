import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export const Body2 = (props: Props) => {
	return (
		<p {...props} className={`text-sm md:text-base ${props.className}`}>
			{props.children}
		</p>
	);
};
