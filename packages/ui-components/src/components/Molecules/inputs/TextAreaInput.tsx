import React, { InputHTMLAttributes } from "react";
import cx from "classnames";

import { Body2 } from "../../atoms";

export interface TextAreaInputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
	label?: string | undefined;
	focusColor?: string;
	disabled?: boolean;
	status?: 'default' | 'success' | 'warning' | 'error';
}

export const TextAreaInput = (props: TextAreaInputProps) => {
	const { focusColor = "primary-blue-400", status = 'default', disabled = false, label } = props;
	const statusClass = !disabled && cx({
		"border-neutral-300": status === 'default',
		"border-semantic-success": status === 'success', 
		"border-semantic-warning": status === 'warning',
		"border-semantic-error": status === 'error',
	});

	return (
		<div>
			{label && (
				<Body2 color="neutral-600" className="mb-2">
					{label}
				</Body2>
			)}
			<textarea
				id="text-area-input"
				className={cx(
					"block w-full p-3 border-2 rounded-base outline-none transition-colors",
					disabled ? "bg-neutral-200 text-neutral-500" : "bg-white text-neutral-800",
					statusClass,
					`focus:ring-${focusColor} focus:border-${focusColor}`
				)}
				disabled={disabled}
				{...props}
			/>
		</div>
	);
};
