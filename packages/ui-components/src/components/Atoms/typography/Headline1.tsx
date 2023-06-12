import React, { HTMLAttributes } from "react";
import cx from "classnames";

interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
	color?: string;
}

const Headline1 = ({ color, children, ...props }: HeadlineProps) => {
	return (
		<h1 {...props} className={cx("text-5xl md:text-7xl pb-base", color && `text-${color}`)}>
			{children}
		</h1>
	);
};

export default Headline1;
