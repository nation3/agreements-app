import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	classname?: string;
}

const Headline4 = (props: Props) => {
	return (
		<h4 {...props} className={`text-lg md:text-3xl ${props.classname}`}>
			{props.children}
		</h4>
	);
};

export default Headline4;
