import React, { useState } from "react";
import cx from "classnames";

import Spinner from "./Spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label?: string;
	size?: "medium" | "small" | "compact";
	border?: string;
	disabled?: boolean;
	loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	label,
	children,
	border = "primary-blue-600",
	size = "medium",
	disabled = false,
	loading = false,
	className,
	...props
}) => {
	const [isPressed, setIsPressed] = useState(false);

	const sizeClass = cx({
		"h-12 px-6 text-sm": size === "medium",
		"h-10 px-4 text-sm": size === "small",
		"h-8 px-2 text-xs": size === "compact",
	});
	const styleClass = cx({
		"bg-neutral-200 text-neutral-400": disabled,
		[`border-2 border-${border} bg-neutral-100 text-neutral-800`]: !disabled,
	});
	const effectClass = cx({
		"shadow-sm": !disabled && !isPressed,
		"hover:shadow-md": !isPressed && !disabled && !loading,
		"cursor-default": !disabled && loading,
		"cursor-not-allowed": disabled,
	});

	return (
		<button
			className={cx(
				"flex items-center justify-center w-fit rounded-full gap-2 transition-all",
				sizeClass,
				styleClass,
				effectClass,
				className,
			)}
			onMouseDown={() => setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			onTouchStart={() => setIsPressed(true)}
			onTouchEnd={() => setIsPressed(false)}
			{...props}
		>
			<span
				className={cx(
					"flex items-center gap-2 justify-center flex-nowrap whitespace-nowrap overflow-hidden transition-opacity",
					loading ? "opacity-0" : "opacity-100",
				)}
			>
				{children ?? label}
			</span>
			<span
				className={cx(
					"absolute flex items-center justify-center w-full h-full transition-opacity pointer-events-none",
					loading ? "opacity-100" : "opacity-0",
				)}
			>
				<Spinner className={`w-4 h-4 fill-${border}`} />
			</span>
		</button>
	);
};

export default Button;
