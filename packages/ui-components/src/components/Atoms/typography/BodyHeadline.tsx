import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
	color?: string;
}

export const BodyHeadline = (props: Props) => {
	const { color, children, className } = props;
	return (
		<h5
			{...props}
			className={`text-xl md:text-head tracking-wide font-semibold text-${
				color ? color : "neutral-c-800"
			} ${props.className}`}
		>
			{props.children}
		</h5>
	);
};
