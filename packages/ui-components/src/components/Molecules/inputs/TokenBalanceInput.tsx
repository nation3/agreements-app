import React, { InputHTMLAttributes } from "react";
import { Body3 } from "../../Atoms";

export interface TokenBalanceInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
	token?: string;
	label?: string | undefined;
}

export const TokenBalanceInput = ({
	focusColor = "bluesky",
	placeholder = "0",
	token,
	label,
	...props
}: TokenBalanceInputProps) => {
	return (
		<div className="">
			{label && <Body3 color="neutral-c-600">{label}</Body3>}
			<input
				type="text"
				id="balance-input"
				className={`border-neutral-c-300 bg-white px-min3 h-double border-2 rounded-base focus:ring-${focusColor} focus:border-${focusColor} block flex-1 min-w-0 w-full text-sm border-gray-300 p-min3`}
				placeholder={placeholder}
				{...props}
			/>
			{/* 			<span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-r-md border border-l-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
				{token}
			</span> */}
		</div>
	);
};
