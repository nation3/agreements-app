import React, { ReactNode, ReactElement } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonBaseProps extends HTMLMotionProps<"button"> {
	disabled?: boolean;
}

export interface ButtonProps extends Omit<ButtonBaseProps, "children"> {
	iconRight?: ReactElement;
	iconLeft?: ReactElement;
	textColor?: string;
	bgColor?: string;
	label?: ReactNode;
}

export const ButtonBase = ({ children, className, ...props }: ButtonBaseProps) => {
	return (
		<motion.button
			className={`flex items-center justify-center w-full p-2 py-3 transition rounded-lg gap-1 ${className}`}
			whileTap={{ scale: 0.95 }}
			{...props}
		>
			{children}
		</motion.button>
	);
};

export const Button = ({
	iconLeft,
	iconRight,
	label,
	textColor = "white",
	bgColor = "bluesky",
	disabled,
	className,
	onClick,
}: ButtonProps) => {
	return (
		<ButtonBase
			className={`text-base font-medium text-${textColor} bg-${bgColor}-${
				disabled ? "300" : "400"
			} ${!disabled && `hover:bg-${bgColor}-500`} ${className && className}`}
			disabled={disabled}
			onClick={onClick}
		>
			{iconLeft && iconLeft}
			{label && label}
			{!iconLeft && iconRight && iconRight}
		</ButtonBase>
	);
};
