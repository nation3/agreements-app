import React from "react";
import cx from "classnames";

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
	color?: string;
}

const Body3 = ({ color, children, className, ...props }: ParagraphProps) => {
	return (
		<p
			className={cx(
				"text-xs md:text-sm tracking-wide",
				color ? `text-${color}` : "text-neutral-800",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
};

export default Body3;
