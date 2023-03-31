import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	classname?: string;
}

const Body1 = (props: Props) => {
	return (
		<p {...props} className={`text-xs md:text-sm ${props.classname}`}>
			{props.children}
		</p>
	);
};

export default Body1;
