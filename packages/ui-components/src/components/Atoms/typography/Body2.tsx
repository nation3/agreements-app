import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	classname?: string;
}

const Body2 = (props: Props) => {
	return (
		<p {...props} className={`text-sm md:text-base ${props.classname}`}>
			{props.children}
		</p>
	);
};

export default Body2;
