import React from "react";
import cx from "classnames";

import Label, { LabelProps } from "../../atoms/Label";

export interface IconLabelProps extends Omit<LabelProps, "size"> {
	icon?: React.ReactElement;
	iconPosition?: "left" | "right";
}

const IconLabel: React.FC<IconLabelProps> = ({
	children,
	icon: Icon,
	iconPosition = "left",
	className,
	...props
}) => {
	return (
		<Label
			className={cx("border-none gap-2", iconPosition === "left" ? "pl-0" : "pr-0", className)}
			size="small"
			{...props}
		>
			{iconPosition === "left" && Icon}
			{children}
			{iconPosition === "right" && Icon}
		</Label>
	);
};

export default IconLabel;
