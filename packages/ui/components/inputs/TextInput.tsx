const TextInput = ({
	value,
	placeholder,
	onChange,
}: {
	value?: string;
	placeholder?: string;
	onChange?: () => void;
}) => {
	return (
		<div>
			<input
				type="text"
				id="address"
				class="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-n3blue focus:border-n3blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-n3blue dark:focus:border-n3blue"
				value={value}
				placeholder={placeholder || "Write here"}
				onChange={onChange}
			/>
		</div>
	);
};

export default TextInput;
