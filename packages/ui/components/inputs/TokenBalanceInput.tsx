// TODO: Control non numeric inputs
const TokenBalanceInput = ({
	value,
	token,
	onChange,
}: {
	value?: number;
	token?: string;
	onChange?: (e?: any) => void;
}) => {
	return (
		<div className="flex">
			<input
				type="number"
				id="balance"
				className="rounded-none rounded-l-lg bg-gray-50 border text-gray-900 focus:ring-n3blue focus:border-n3blue block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-n3blue dark:focus:border-n3blue"
				value={value}
				placeholder="0"
				onChange={onChange}
			/>
			<span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-r-md border border-l-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
				{token}
			</span>
		</div>
	);
};

export default TokenBalanceInput;
