import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export const HeadlineBasic = (props: Props) => {
	return (
		<h5 {...props} className={`text-lg md:text-xl font-bold ${props.className}`}>
			{props.children}
		</h5>
	);
};
