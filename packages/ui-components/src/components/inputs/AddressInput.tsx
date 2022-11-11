import clsx from "clsx";
import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { validateAddress } from "../../utils";

export interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
}

export const AddressInput = ({ focusColor = "bluesky", ...props }: AddressInputProps) => {
	const [isValid, setIsValid] = React.useState(true);

	const checkAddress = (value: ChangeEvent<HTMLInputElement>) => {
		setIsValid(validateAddress(value.target.value));
	};
	return (
		<div>
			<input
				type="text"
				id="text-input"
				className={clsx(
					`bg-gray-50 text-gray-800 text-sm rounded-lg block w-full p-2.5`,
					isValid
						? `border border-gray-300 focus:border-${focusColor} focus:ring-${focusColor}`
						: "border-solid ring-1 border-red-600 ring-red-600 focus:border-red-600 focus:ring-red-600",
				)}
				onBlur={(e) => checkAddress(e)}
				{...props}
			/>
		</div>
	);
};
