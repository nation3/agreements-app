import clsx from "clsx";
import { ethers, providers } from "ethers";
import React, { ChangeEvent, InputHTMLAttributes, useEffect, useState } from "react";
import { Body3 } from "../../Atoms";
import Spinner from "../../Atoms/Spinner";

export interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
	onBlurCustom?: (e: ChangeEvent<HTMLInputElement>) => void;
	ensProvider?: providers.BaseProvider | undefined;
	label?: string | undefined;
	defaultValue?: string | undefined;
	showEnsName?: boolean;
}

export const AddressInput = (props: AddressInputProps) => {
	const {
		focusColor = "pr-c-blue-3",
		ensProvider,
		defaultValue,
		label,
		onBlurCustom,
		showEnsName = false,
	} = props;
	const [isValid, setIsValid] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [ensName, setEnsName] = useState("");

	useEffect(() => {
		setInputValue(defaultValue ?? "");
	}, [props.defaultValue]);

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
		setIsValid(address ? true : false);
		if (address) {
			setEnsName(addressOrEns); // Update the ENS name
		}
		onBlurCustom?.({ ...e, target: { ...e.target, value: address ?? e.target.value } });
	};

	return (
		<div>
			{label && <Body3 color="neutral-c-600">{label}</Body3>}
			<div className={clsx("flex items-center justify-center relative")}>
				<input
					type="text"
					id="text-input"
					value={showEnsName && ensName ? ensName : inputValue}
					className={clsx(
						`border-neutral-c-300 flex bg-white border-2 relative h-double rounded-base  focus:border-${focusColor} block flex-1 min-w-0 w-full text-sm `,
					)}
					onChange={(e) => setInputValue(e.target.value)}
					onBlur={handleBlur}
					{...props}
				/>
				{isLoading && (
					<Spinner className="text-pr-c-blue3 w-5 h-5 absolute right-min3 top-[14px]" />
				)}
			</div>
		</div>
	);
};
