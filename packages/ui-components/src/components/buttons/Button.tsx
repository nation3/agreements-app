import React, { ReactNode, ReactElement } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Spinner } from "../svgs";

export interface ButtonBaseProps extends HTMLMotionProps<"button"> {
	disabled?: boolean;
}

export interface ButtonProps extends Omit<ButtonBaseProps, "children"> {
	iconRight?: ReactElement;
	iconLeft?: ReactElement;
	textColor?: string;
	bgColor?: string;
	label?: ReactNode;
	isLoading?: boolean;
}

export const ButtonBase = ({ children, className, ...props }: ButtonBaseProps) => {
	return (
		<motion.button
			className={`flex items-center justify-center w-full transition rounded-lg ${className}`}
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
	isLoading = false,
	onClick,
}: ButtonProps) => {
	return (
		<ButtonBase
			className={`px-2 py-3 gap-1 text-base transition-colors font-medium text-${textColor} bg-${bgColor}-${
				disabled ? "300" : "400"
			} ${!disabled && `hover:bg-${bgColor}-500 hover:cursor-pointer`} ${className && className}`}
			disabled={disabled}
			onClick={onClick}
		>
			{isLoading ? (
				<Spinner className="w-5 h-5" />
			) : (
				<>
					{iconLeft && iconLeft}
					{label && label}
					{!iconLeft && iconRight && iconRight}
				</>
			)}
		</ButtonBase>
	);
};
