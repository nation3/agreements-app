import React, { ReactNode, ReactElement } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import cx from "classnames";
import Spinner from "../../Atoms/Spinner";
import { Body2 } from "../../Atoms";
import classNames from "classnames";

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
	className?: string;
}

export const ButtonBase = ({ children, className, ...props }: ButtonBaseProps) => {
	return (
		<motion.button
			className={`flex items-center justify-center rounded-lg ${className}`}
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
				"px-base py-min2 transition-colors gap-1 border-2 text-neutral-c-800 w-auto",
				disabled
					? "text-neutral-c-300  border-neutral-c-300"
					: "text-neutral-c-500  border-pr-c-blue3",
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
					<Body2 className="font-medium tracking-wide">{label && label}</Body2>
					{!iconLeft && iconRight && iconRight}
				</>
			)}
		</ButtonBase>
	);
};
