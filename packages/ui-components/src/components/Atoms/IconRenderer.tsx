import React from "react";
import cx from "classnames";
import Image from "next/image";

type Icon = React.ReactNode | string;

interface IconRendererProps {
	icon: Icon;
	backgroundColor: string;
	size: keyof typeof iconSpacing;
	rounded?: boolean;
	className?: string;
}

const iconSpacing = {
	xs: 24,
	sm: 48,
	md: 96,
	lg: 192,
	xl: 384,
};

const IconRenderer: React.FC<IconRendererProps> = (props) => {
	const { icon, backgroundColor, size, className, rounded = false } = props;
	const squareSize = iconSpacing[size];

	const renderIcon = (icon: Icon) => {
		if (typeof icon === "string") {
			return <Image src={icon} alt="Icon" width={squareSize / 1.5} height={squareSize / 1.5} />;
		}
		return icon;
	};

	return (
		<div
			className={cx(
				"relative",
				"inline-block",
				`bg-${backgroundColor}`,
				"flex items-center justify-center rounded-base",
				className,
			)}
			style={{
				width: squareSize,
				height: squareSize,
			}}
		>
			<div
				style={{
					width: squareSize,
					height: squareSize,
				}}
				className="flex items-center justify-center"
			>
				{renderIcon(icon)}
			</div>
		</div>
	);
};

export default IconRenderer;
