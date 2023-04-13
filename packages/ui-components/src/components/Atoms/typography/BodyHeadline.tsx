import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export const BodyHeadline = (props: Props) => {
	return (
		<h5 {...props} className={`text-base md:text-lg font-bold ${props.className}`}>
			{props.children}
		</h5>
	);
};
