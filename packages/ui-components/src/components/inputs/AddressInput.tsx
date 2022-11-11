import clsx from "clsx";
import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { validateAddress } from "../../utils";

export interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
}

export const AddressInput = ({ focusColor = "bluesky", ...props }: AddressInputProps) => {
	const [error, setError] = React.useState(false);

	const checkAddress = (value: ChangeEvent<HTMLInputElement>) => {
		setError(validateAddress(value.target.value));
	};
	return (
		<div>
			<input
				type="text"
				id="text-input"
				className={clsx(
					`bg-gray-50 text-gray-800 text-sm rounded-lg block w-full p-2.5`,
					!error
						? "border-solid ring-1 border-red-600 ring-red-600 focus:border-red-600 focus:ring-red-600"
						: `border border-gray-300 focus:border-${focusColor} focus:ring-${focusColor}`,
				)}
				onBlur={(e) => checkAddress(e)}
				{...props}
			/>
		</div>
	);
};
