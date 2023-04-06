import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export const Body3 = (props: Props) => {
	return (
		<p {...props} className={`text-xs md:text-sm ${props.className}`}>
			{props.children}
		</p>
	);
};
