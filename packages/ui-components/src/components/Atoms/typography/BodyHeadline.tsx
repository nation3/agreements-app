import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export const BodyHeadline = (props: Props) => {
	return (
		<h5
			{...props}
			className={`text-xl md:text-head tracking-wide font-semibold ${props.className}`}
		>
			{props.children}
		</h5>
	);
};
