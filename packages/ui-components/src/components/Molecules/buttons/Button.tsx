import React, { ReactNode, ReactElement } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import cx from "classnames";
import Spinner from "../../Atoms/Spinner";

export interface ButtonBaseProps extends HTMLMotionProps<"button"> {
	disabled?: boolean;
}

export interface ButtonProps extends Omit<ButtonBaseProps, "children"> {
	iconRight?: ReactElement;
	iconLeft?: ReactElement;
	textColor?: string;
	bgColor?: string;
	outlined?: boolean;
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

export const Button = (props: ButtonProps) => {
	const {
		iconLeft,
		iconRight,
		label,
		outlined,
		disabled,
		className,
		isLoading = false,
		onClick,
	} = props;

	return (
		<ButtonBase
			className={cx(
				"px-2 py-3 transition-colors gap-1 tracking-wide text-base font-medium border-2",
				disabled && "bg-bluesky-100 border-bluesky-100",
				!disabled &&
					"hover:bg-bluesky-500 hover:border-bluesky-500 hover:cursor-pointer border-bluesky-400",
				outlined &&
					`bg-white text-bluesky-400 hover:text-white hover:bg-bluesky-500 hover:border-bluesky-500`,
				!outlined && "text-white bg-bluesky-400 border-bluesky-400",
				`${className && className}`,
			)}
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
