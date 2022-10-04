import React from "react";
import { ButtonBase, ButtonBaseProps } from "./Button";

export const TransparentButton = ({ className = "", ...props }: ButtonBaseProps) => {
	return (
		<ButtonBase className={`bg-transparent text-base hover:bg-gray-200 ${className}`} {...props} />
	);
};
