import React, { ReactElement } from "react";
import { ButtonBase, ButtonBaseProps } from "../buttons/Button";

export interface IconButtonProps extends Omit<ButtonBaseProps, "children"> {
	icon: ReactElement;
	textColor?: string;
	bgColor?: string;
	disabled?: boolean;
}

export const IconButton = ({
	icon,
	textColor = "white",
	bgColor = "bluesky",
	disabled,
	...props
}: IconButtonProps) => {
	return (
		<div className="w-min">
			<ButtonBase
				className={`text-${textColor} bg-${bgColor}-${disabled ? "300" : "400"} ${
					!disabled && `hover:bg-${bgColor}-500`
				} px-2 py-2`}
				{...props}
			>
				{icon}
			</ButtonBase>
		</div>
	);
};
