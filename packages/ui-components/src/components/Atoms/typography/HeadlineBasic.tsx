import React, { HTMLAttributes } from "react";
import cx from "classnames";

interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
	color?: string;
}

const HeadlineBasic = ({ color, children, className, ...props }: HeadlineProps) => {
	return (
		<h4
			{...props}
			className={cx("text-lg md:text-xl font-bold", color && `text-${color}`, className)}
		>
			{children}
		</h4>
	);
};

export default HeadlineBasic;
