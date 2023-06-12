import React, { HTMLAttributes } from "react";
import cx from "classnames";

import { ActionContainer } from "../../atoms/containers";

export interface RoundedHandlerProps extends HTMLAttributes<HTMLDivElement> {
	icon: React.ReactElement;
	iconPosition?: "left" | "right";
}

const RoundedHandler: React.FC<RoundedHandlerProps> = ({
	icon: Icon,
	iconPosition = "left",
	className,
	children,
	...props
}) => {
	return (
		<ActionContainer className="rounded-full">
			<div
				className={cx(
					"flex items-center justify-center w-fit flex-nowrap overflow-hidden rounded-full transition-all p-1",
					iconPosition === "left" ? "pr-3" : "pl-3",
					"text-sm text-neutral-800",
					"bg-neutral-100",
					"gap-1",
					className,
				)}
				{...props}
			>
				{iconPosition === "left" && Icon}
				{children}
				{iconPosition === "right" && Icon}
			</div>
		</ActionContainer>
	);
};

export default RoundedHandler;
