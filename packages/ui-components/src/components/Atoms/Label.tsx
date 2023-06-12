import React, { HTMLAttributes } from "react";
import cx from "classnames";

export interface LabelProps extends HTMLAttributes<HTMLDivElement> {
	size?: "medium" | "small";
	color?: string;
	background?: string;
	border?: string;
}

const Label: React.FC<LabelProps> = ({
	children,
	size = "medium",
	color = "neutral-800",
	background = "neutral-100",
	border = "neutral-200",
	className,
	...props
}) => {
	return (
		<div
			className={cx(
				"flex items-center justify-center w-fit flex-nowrap rounded px-2",
				size === "small" ? "text-xs" : "text-sm py-0.5",
				`border-2 border-${border}`,
				`text-${color} bg-${background}`,
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export default Label;
