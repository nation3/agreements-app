import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	classname?: string;
}

export const BodyHeadline = (props: Props) => {
	return (
		<h5
			{...props}
			className={`text-base md:text-lg font-bold md:pb-min3 pb-min2 ${props.classname}`}
		>
			{props.children}
		</h5>
	);
};
