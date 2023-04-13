import clsx from "clsx";
import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { ethers, providers } from "ethers";

export interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
	onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
	ensProvider?: providers.BaseProvider | undefined;
}

export async function fetchEnsAddress({
	provider,
	name,
}: {
	provider: providers.BaseProvider;
	name: string;
}): Promise<string | null> {
	const address = await provider.resolveName(name);

	try {
		return address ? ethers.utils.getAddress(address) : null;
	} catch (_error) {
		return null;
	}
}

export const AddressInput = ({
	focusColor = "bluesky",
	ensProvider,
	onBlur,
	...props
}: AddressInputProps) => {
	const [isValid, setIsValid] = React.useState(true);

	const fetchAddress = async (value: string) => {
		try {
			const address = (await ensProvider?.resolveName(value)) ?? value;
			return ethers.utils.getAddress(address) ?? null;
		} catch (_error) {
			return null;
		}
	};

	return (
		<div>
			<input
				type="text"
				id="text-input"
				className={clsx(
					`border-neutral-300 bg-white text-gray-800 text-sm rounded block w-full p-min2 border-2`,
					isValid
						? `border border-gray-300 focus:border-${focusColor} focus:ring-${focusColor}`
						: "border-solid ring-1 border-red-600 ring-red-600 focus:border-red-600 focus:ring-red-600",
				)}
				onBlur={(e) => {
					fetchAddress(e.target.value)
						.then((address) => {
							e.target.value = address ?? e.target.value;
							setIsValid(address ? true : false);
							onBlur?.(e);
							return null;
						})
						.catch((error) => console.log(error));
				}}
				{...props}
			/>
		</div>
	);
};
