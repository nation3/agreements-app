import React, { InputHTMLAttributes } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
}

export const TextInput = ({ focusColor = "bluesky", ...props }: TextInputProps) => {
	return (
		<div>
			<input
				type="text"
				id="text-input"
				className={`bg-white border-2 border-neutral-c-200 text-neutral-c-500 tracking-wide rounded focus:ring-${focusColor} focus:border-${focusColor} block w-full p-min3 rounded`}
				{...props}
			/>
		</div>
	);
};
