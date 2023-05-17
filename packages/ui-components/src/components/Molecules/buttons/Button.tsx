import cx from "classnames";
import { HTMLMotionProps, motion } from "framer-motion";
import React, { ReactElement, ReactNode } from "react";
import { Body3 } from "../../Atoms";
import Spinner from "../../Atoms/Spinner";

export interface ButtonBaseProps extends HTMLMotionProps<"button"> {
	disabled?: boolean;
	size?: "normal" | "medium" | "small";
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

export const ButtonBase = ({ children, className, size = "normal", ...props }: ButtonBaseProps) => {
	const sizeClasses = {
		normal: "px-base py-[14px]",
		medium: "px-[18px] py-[14px]",
		small: "px-min3 py-min2",
	};

	return (
		<motion.button
			className={`flex items-center justify-center rounded-full ${className} ${sizeClasses[size]}`}
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
		textColor,
		disabled,
		className,
		isLoading = false,
		onClick,
		size,
	} = props;

	return (
		<ButtonBase
			className={cx(
				"cursor-pointer rounded-full shadow-sm hover:shadow gap-min1 border-2 bg-white transition-all text-neutral-c-800 w-auto",
				disabled
					? "text-neutral-c-300  border-neutral-c-300"
					: "text-neutral-c-500  border-pr-c-blue3",
				`${className && className}`,
			)}
			disabled={disabled}
			onClick={onClick}
			size={size}
		>
			{isLoading ? (
				<Spinner className="w-5 h-5" />
			) : (
				<>
					{iconLeft && <span className="mr-min2">{iconLeft}</span>}
					<Body3 color={textColor ? textColor : ""} className="font-medium tracking-wide">
						{label && label}
					</Body3>
					{!iconLeft && iconRight && <span className="ml-min2">{iconRight}</span>}
				</>
			)}
		</ButtonBase>
	);
};
