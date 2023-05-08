import React, { HTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	size?: "base" | "double";
	className?: string;
}

const defaultProps: CardProps = {};

const Card: React.FC<CardProps> = (props) => {
	const { children, className, size, ...rest } = props;
	const cardClass = classNames(
		size ? `p-${size}` : `p-base md:p-double`,
		"w-full",
		"bg-white",
		"rounded-lg",
		"border-2",
		"border-neutral-c-200",
		className,
	);

	return (
		<div className={cardClass} {...rest}>
			{children}
		</div>
	);
};

Card.defaultProps = defaultProps;

export { Card };
