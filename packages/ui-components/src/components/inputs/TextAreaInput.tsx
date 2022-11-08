import React, { TextareaHTMLAttributes } from "react";

export interface TextAreaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	focusColor?: string;
}

export const TextAreaInput = ({ focusColor = "bluesky", ...props }: TextAreaInputProps) => {
	return (
		<div>
			<textarea
				id="text-area"
				className={`block p-2.5 w-full text-sm text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-0 focus:border-2 focus:border-${focusColor}`}
				{...props}
			/>
		</div>
	);
};
