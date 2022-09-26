const TextInput = ({
	value,
	placeholder,
	onChange,
}: {
	value?: string;
	placeholder?: string;
	onChange?: (e?: any) => void;
}) => {
	return (
		<div>
			<input
				type="text"
				id="text"
				className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-n3blue focus:border-n3blue block w-full p-2.5"
				value={value}
				placeholder={placeholder || "Write here"}
				onChange={onChange}
			/>
		</div>
	);
};

export default TextInput;
