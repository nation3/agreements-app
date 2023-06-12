import React from "react";
import cx from "classnames";

interface HeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
	color?: string;
}

const Headline2 = ({ color, children, ...props }: HeadlineProps) => {
	return (
		<h2 {...props} className={cx("text-5xl md:text-6xl pb-base", color && `text-${color}`)}>
			{children}
		</h2>
	);
};

export default Headline2;
