import React from "react";

type CustomRadioInputProps = {
	id: string;
	name: string;
	value: string;
	label: string;
	checked: boolean;
	disabled?: boolean;
	onChange: (value: string) => void;
};

export const CustomRadioInput: React.FC<CustomRadioInputProps> = ({
	id,
	name,
	value,
	label,
	checked,
	disabled = false,
	onChange,
}) => {
	return (
		<label
			htmlFor={id}
			className={`flex items-center space-x-2 cursor-pointer${
				disabled ? " opacity-50 cursor-not-allowed" : ""
			}`}
		>
			<input
				id={id}
				name={name}
				type="radio"
				value={value}
				checked={checked}
				disabled={disabled}
				onChange={() => onChange(value)}
				className="form-radio text-pr-c-green2"
			/>
			<span>{label}</span>
		</label>
	);
};
