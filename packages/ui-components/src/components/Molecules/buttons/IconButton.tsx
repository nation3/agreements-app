import React, { ReactElement } from "react";
import { ButtonBase, ButtonBaseProps } from "../buttons/Button";

export interface IconButtonProps extends Omit<ButtonBaseProps, "children"> {
	icon: ReactElement;
	textColor?: string;
	bgColor?: string;
	rounded?: boolean;
	disabled?: boolean;
}

export const IconButton = ({
	icon,
	textColor = "white",
	bgColor = "bluesky",
	rounded,
	disabled,
	...props
}: IconButtonProps) => {
	return (
		<div className="w-min">
			<ButtonBase
				className={`text-${textColor} bg-${bgColor}-${disabled ? "300" : "400"} ${
					!disabled && `hover:bg-${bgColor}-500`
				} ${rounded ? "rounded-full p-0.5" : "p-2"}`}
				disabled={disabled}
				{...props}
			>
				{icon}
			</ButtonBase>
		</div>
	);
};
