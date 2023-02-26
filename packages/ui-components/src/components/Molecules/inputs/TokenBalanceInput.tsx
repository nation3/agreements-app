import React, { InputHTMLAttributes } from "react";

export interface TokenBalanceInputProps extends InputHTMLAttributes<HTMLInputElement> {
	focusColor?: string;
	token?: string;
}

export const TokenBalanceInput = ({
	focusColor = "bluesky",
	placeholder = "0",
	token,
	...props
}: TokenBalanceInputProps) => {
	return (
		<div className="flex">
			<input
				type="text"
				id="balance-input"
				className={`rounded-none rounded-lg bg-gray-50 border text-gray-900 focus:ring-${focusColor} focus:border-${focusColor} block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5`}
				placeholder={placeholder}
				{...props}
			/>
			{/* 			<span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-r-md border border-l-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
				{token}
			</span> */}
		</div>
	);
};
