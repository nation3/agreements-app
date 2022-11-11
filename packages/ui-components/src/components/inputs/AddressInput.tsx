import clsx from "clsx";
import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { ethers } from "ethers";

export interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
	onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const AddressInput = ({ focusColor = "bluesky", onBlur, ...props }: AddressInputProps) => {
	const [isValid, setIsValid] = React.useState(true);

	const checkAddress = (address: string) => {
		setIsValid(ethers.utils.isAddress(address));
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
				onBlur={(e) => {
					checkAddress(e.target.value);
					onBlur?.(e);
				}}
				{...props}
			/>
		</div>
	);
};
