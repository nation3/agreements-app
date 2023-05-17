import React, { InputHTMLAttributes } from "react";
import { Body2 } from "../../Atoms";

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
	label?: string | undefined;
}

export const PasswordInput = (props: PasswordInputProps) => {
	const { focusColor = "bluesky", label } = props;
	return (
		<div>
			{label && <Body2 className="mb-min2">{label}</Body2>}
			<input
				type="password"
				id="password-input"
				className={`border-neutral-c-300 bg-white p-min2 border-2 rounded-base focus:ring-${focusColor} focus:border-${focusColor} block w-full p-min3`}
				{...props}
			/>
		</div>
	);
};
