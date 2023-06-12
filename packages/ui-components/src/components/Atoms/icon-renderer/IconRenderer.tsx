import React from "react";
import cx from "classnames";

type IconSizes = "extra-small" | "small" | "large" | "custom";

export interface IconRendererProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
	icon: React.FC<React.SVGProps<SVGSVGElement>>;
	size?: IconSizes;
	rounded?: boolean;
	color?: string;
	background?: string;
	iconClass?: string;
	containerClass?: string;
}

const IconRenderer = ({
	icon: Icon,
	size = "small",
	rounded = true,
	color = "black",
	background,
	iconClass,
	containerClass
}: IconRendererProps) => {
	const sizeClass = cx({
		"w-4 h-4": size === "extra-small",
		"w-6 h-6": size === "small",
		"w-10 h-10": size === "large",
	});
	const paddingClass = cx({
		"p-2": size === "large",
	});
	const roundingClass = cx({
		"rounded-sm": size === "small",
		"rounded-md": size === "large",
		"rounded": !["large", "small"].includes(size),
	});

	return (
		<div
			className={cx(
				"flex items-center justify-center w-fit transition-all",
				paddingClass,
				rounded && roundingClass,
				background ? `bg-${background}` : "bg-transparent",
				containerClass,
			)}
		>
			<Icon className={cx("transition-all", sizeClass, `fill-${color}`, iconClass)} />
		</div>
	);
};

export default IconRenderer;
