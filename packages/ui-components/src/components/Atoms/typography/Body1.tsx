import React from "react";
import cx from "classnames";

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
	color?: string;
}

const Body1 = ({ color, children, className, ...props }: ParagraphProps) => {
	return (
		<p
			className={cx(
				"text-base md:text-lg font-medium tracking-wide",
				color ? `text-${color}` : "text-neutral-800",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
};

export default Body1;
