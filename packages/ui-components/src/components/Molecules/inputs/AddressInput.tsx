import clsx from "clsx";
import { ethers, providers } from "ethers";
import React, { ChangeEvent, InputHTMLAttributes, useState } from "react";
import { Body3 } from "../../Atoms";
import Spinner from "../../Atoms/Spinner";

export interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
	onBlurCustom?: (e: ChangeEvent<HTMLInputElement>) => void;
	ensProvider?: providers.BaseProvider | undefined;
	label?: string | undefined;
}

export const AddressInput = (props: AddressInputProps) => {
	const { focusColor = "pr-c-blue-3", ensProvider, label, onBlurCustom } = props;
	const [isValid, setIsValid] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

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
		setTimeout(async () => {
			const address = await fetchAddress(e.target.value);
			e.target.value = address ?? e.target.value;
			setIsValid(address ? true : false);
			onBlurCustom?.(e);
		}, 1500);
	};

	return (
		<div>
			{label && <Body3 color="neutral-c-600">{label}</Body3>}
			<div className={clsx("flex items-center justify-center relative")}>
				<input
					type="text"
					id="text-input"
					className={clsx(
						`border-neutral-c-300 flex bg-white border-2 relative h-double rounded-base focus:ring-${focusColor} focus:border-${focusColor} block flex-1 min-w-0 w-full text-sm border-gray-300`,
					)}
					onChange={handleBlur}
					{...props}
				/>
				{isLoading && (
					<Spinner className="text-pr-c-blue3 w-5 h-5 absolute right-min3 top-[14px]" />
				)}
			</div>
		</div>
	);
};
