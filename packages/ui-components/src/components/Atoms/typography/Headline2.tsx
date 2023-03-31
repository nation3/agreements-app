import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	classname?: string;
}

const Headline2 = (props: Props) => {
	return (
		<h2 {...props} className={`text-5xl md:text-7xl ${props.classname}`}>
			{props.children}
		</h2>
	);
};

export default Headline2;
