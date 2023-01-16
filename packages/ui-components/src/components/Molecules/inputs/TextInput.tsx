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
				className={`bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-${focusColor} focus:border-${focusColor} block w-full p-2.5`}
				{...props}
			/>
		</div>
	);
};
