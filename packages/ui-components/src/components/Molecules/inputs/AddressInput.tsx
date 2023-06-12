import React, { ChangeEvent, InputHTMLAttributes, useEffect, useState } from "react";
import cx from "classnames";
import { ethers, providers } from "ethers";

import { Body3, Spinner } from "../../atoms";

export interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
	onBlurCustom?: (e: ChangeEvent<HTMLInputElement>) => void;
	ensProvider?: providers.BaseProvider | undefined;
	label?: string | undefined;
	defaultValue?: string | undefined;
	showEnsName?: boolean;
	disabled?: boolean;
	status?: 'default' | 'success' | 'warning' | 'error';
}

export const AddressInput = (props: AddressInputProps) => {
	const {
		focusColor = "primary-blue-200",
		ensProvider,
		defaultValue,
		label,
		status = 'default',
		onBlurCustom,
		disabled = false,
		showEnsName = false,
	} = props;
	// const [isValid, setIsValid] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [ensName, setEnsName] = useState("");

	const statusClass = !disabled && cx({
		"border-neutral-300": status === 'default',
		"border-semantic-success": status === 'success', 
		"border-semantic-warning": status === 'warning',
		"border-semantic-error": status === 'error',
	});

	useEffect(() => {
		setInputValue(defaultValue ?? "");
	}, [defaultValue]);

	const fetchAddress = async (value: string) => {
		setIsLoading(true);
		try {
			const address = (await ensProvider?.resolveName(value)) ?? value;
			setIsLoading(false);
			return ethers.utils.getAddress(address) ?? null;
		} catch (_error) {
			setIsLoading(false);
			return null;
		}
	};

	const handleBlur = async (e: ChangeEvent<HTMLInputElement>) => {
		const addressOrEns = e.target.value;
		const address = await fetchAddress(addressOrEns);
		// setIsValid(address ? true : false);
		if (address) {
			setEnsName(addressOrEns); // Update the ENS name
		}
		onBlurCustom?.({ ...e, target: { ...e.target, value: address ?? e.target.value } });
	};

	return (
		<div>
			{label && <Body3 color="neutral-600 mb-3">{label}</Body3>}
			<div className={cx("flex items-center justify-center relative")}>
				<input
					type="text"
					id="text-input"
					value={showEnsName && ensName ? ensName : inputValue}
					className={cx(
					"block w-full p-3 border-2 rounded-base outline-none transition-all",
					disabled ? "bg-neutral-200 text-neutral-500" : "bg-white text-neutral-800",
					statusClass,
					`focus:ring-${focusColor} focus:border-${focusColor}`
					)}
					onChange={(e) => setInputValue(e.target.value)}
					onBlur={handleBlur}
					{...props}
				/>
				{isLoading && (
					<Spinner className="text-primary-blue-100 w-5 h-5 absolute right-3 top-[14px]" />
				)}
			</div>
		</div>
	);
};
