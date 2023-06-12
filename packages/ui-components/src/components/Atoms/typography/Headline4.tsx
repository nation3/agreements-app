import React, { HTMLAttributes } from "react";
import cx from "classnames";

interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
	color?: string;
}

const Headline4 = ({ color, children, className, ...props }: HeadlineProps) => {
	return (
		<h4
			{...props}
			className={cx(
				"text-lg md:text-3xl pb-min3 md:pb-base font-medium",
				color && `text-${color}`,
				className,
			)}
		>
			{children}
		</h4>
	);
};

export default Headline4;
