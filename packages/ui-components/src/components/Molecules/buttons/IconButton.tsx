import React from "react";
import cx from "classnames";

import Button, { ButtonProps } from "../../atoms/Button";

export interface IconButtonProps extends ButtonProps {
	leftIcon?: React.FC<{className?: string}>;
	rightIcon?: React.FC<{className?: string}>;
}

const IconButton = ({
	leftIcon: LeftIcon,
	rightIcon: RightIcon,
	size = "medium",
	disabled = false,
	border = "primary-blue-600",
	className,
	children,
	...props
}: IconButtonProps) => {
	const iconClass = cx(
		size === "compact" ? "w-4 h-4" : "w-6 h-6",
		disabled ? "fill-neutral-400" : `fill-${border}`,
	);
	/* Avoid weird tailwind spacing issues when using jit */
	const leftIconPadding = cx({
		"pl-2": size === "compact",
		"pl-3": size === "small",
		"pl-4": size === "medium",
	});
	const rightIconPadding = cx({
		"pr-2": size === "compact",
		"pr-3": size === "small",
		"pr-4": size === "medium",
	});

	return (
		<Button
			size={size}
			disabled={disabled}
			border={border}
			className={cx(className, LeftIcon && leftIconPadding, RightIcon && rightIconPadding)}
			{...props}
		>
			{LeftIcon && <LeftIcon className={iconClass} />}
			{children}
			{RightIcon && <RightIcon className={iconClass} />}
		</Button>
	);
};

export default IconButton;
