import React from "react";
import cx from "classnames";

interface HeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
	color?: string;
}

const BodyHeadline = ({ color, children, className, ...props }: HeadlineProps) => {
	return (
		<h5
			className={cx(
				"text-xl md:text-head tracking-wide line-clamp-2 font-semibold",
				color && `text-${color}`,
				className,
			)}
			{...props}
		>
			{children}
		</h5>
	);
};

export default BodyHeadline;
