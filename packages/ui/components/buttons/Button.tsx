import React from "react";
import { motion } from "framer-motion";

const Button = ({
	label,
	disabled,
	onClick,
}: {
	label: string;
	disabled?: boolean;
	onClick?: () => void;
}) => {
	const baseClass =
		"flex items-center justify-center w-full p-2 py-3 text-base font-medium transition rounded-lg font-primary";
	const bgClass = disabled ? "bg-n3blue-200" : "bg-n3blue hover:bg-n3blue-500";
	const textClass = "text-white";
	const cursorClass = disabled ? "cursor-not-allowed" : "cursor-pointer";

	return (
		<motion.button
			onClick={onClick}
			type="button"
			whileTap={{ scale: 0.95 }}
			disabled={disabled}
			className={`${baseClass} ${bgClass} ${textClass} ${cursorClass}`}
		>
			{label}
		</motion.button>
	);
};

export default Button;
