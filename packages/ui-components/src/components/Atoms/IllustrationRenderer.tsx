import cx from "classnames";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

type Icon = React.ReactNode | string;

interface IllustrationRendererProps {
	icon: Icon;
	size: keyof typeof iconSpacing;
	rounded?: boolean;
	customSize?: number;
	className?: string;
	fillColor?: string;
}

const iconSpacing = {
	xs: 24,
	sm: 48,
	md: 96,
	lg: 192,
	xl: 384,
};

const CenteredIcon = styled.div<{
	fill: string;
}>`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	svg {
		height: 100%;
		width: 100%;
		fill: ${(props) => "var(--tw-" + props.fill + ")"};
	}
`;

const IllustrationRenderer: React.FC<IllustrationRendererProps> = (props) => {
	const { icon, size, className, rounded = false, customSize, fillColor = "" } = props;
	let squareSize;
	if (customSize !== undefined) {
		squareSize = customSize;
	} else {
		squareSize = iconSpacing[size];
	}
	const renderIcon = (icon: Icon) => {
		if (typeof icon === "string") {
			return <Image src={icon} alt="Icon" />;
		}
		return <CenteredIcon fill={fillColor}>{icon}</CenteredIcon>;
	};

	return (
		<div
			className={cx(
				"relative",
				"inline-block",
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

export default IllustrationRenderer;
