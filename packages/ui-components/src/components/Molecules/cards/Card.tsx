import React, { HTMLAttributes, ReactNode } from "react";
import cx from "classnames";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	className?: string;
}

const Card: React.FC<CardProps> = (props) => {
	const { children, className, ...rest } = props;
	const cardClass = cx(
		"p-4",
		"w-full",
		"bg-white",
		"rounded-lg",
		"border-2",
		"border-neutral-c-200",
		"transition-all",
		className,
	);

	return (
		<div className={cardClass} {...rest}>
			{children}
		</div>
	);
};

export default Card;
