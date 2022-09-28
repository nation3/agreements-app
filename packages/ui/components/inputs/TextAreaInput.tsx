const TextAreaInput = ({
	value,
	rows,
	placeholder,
	onChange,
}: {
	value?: string;
	rows?: number;
	placeholder?: string;
	onChange?: (e?: any) => void;
}) => {
	return (
		<div>
			<textarea
				id="text-area"
				rows={rows ?? 8}
				className="block p-2.5 w-full text-sm text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:ring-0 focus:border-2 focus:border-n3blue"
				value={value}
				placeholder={placeholder || "Write here"}
				onChange={onChange}
			/>
		</div>
	);
};

export default TextAreaInput;
