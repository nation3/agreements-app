import clsx from "clsx";
import { ethers, providers } from "ethers";
import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { Body3 } from "../../Atoms";

export interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
	onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
	ensProvider?: providers.BaseProvider | undefined;
	label?: string | undefined;
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

export const AddressInput = (props: AddressInputProps) => {
	const { focusColor = "pr-c-blue-3", ensProvider, label, onBlur } = props;
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
			{label && <Body3>{label}</Body3>}
			<input
				type="text"
				id="text-input"
				className={clsx(
					`border-neutral-c-300 bg-white p-min2 border-2 w-full rounded-base`,
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
