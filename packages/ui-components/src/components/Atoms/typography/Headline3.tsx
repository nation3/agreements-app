import React, { ReactNode } from "react";

interface Props {
	children: ReactNode;
	classname?: string;
}

const Headline3 = (props: Props) => {
	return (
		<h3 {...props} className={`text-3xl md:text-6xl ${props.classname}`}>
			{props.children}
		</h3>
	);
};

export default Headline3;
