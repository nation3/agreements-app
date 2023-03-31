import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	classname?: string;
}

const Body3 = (props: Props) => {
	return (
		<p {...props} className={`text-base md:text-lg ${props.classname}`}>
			{props.children}
		</p>
	);
};

export default Body3;
