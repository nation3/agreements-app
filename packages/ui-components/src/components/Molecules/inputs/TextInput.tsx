import React, { InputHTMLAttributes } from "react";
import { Body2 } from "../../Atoms";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
	label?: string | undefined;
}

export const TextInput = (props: TextInputProps) => {
	const { focusColor = "bluesky", label } = props;
	return (
		<div>
			{label && (
				<Body2 color="neutral-c-600" className="mb-min2">
					{label}
				</Body2>
			)}
			<input
				type="text"
				id="text-input"
				className={`border-neutral-c-300 bg-white p-min2 border-2 rounded-base focus:ring-${focusColor} focus:border-${focusColor} block w-full p-min3`}
				{...props}
			/>
		</div>
	);
};
