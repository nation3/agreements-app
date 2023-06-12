import React from "react";
import cx from "classnames";

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
	color?: string;
}

const Body2 = ({ color, children, className, ...props }: ParagraphProps) => {
	return (
		<p
			className={cx(
				"text-sm md:text-base tracking-wide",
				color ? `text-${color}` : "text-neutral-800",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
};

export default Body2;
