import { StopCircleIcon } from "@heroicons/react/24/solid";
import cx from "classnames";
import React, { ReactNode, useState } from "react";
import { Body3 } from "../Atoms";

interface TextCardProps {
	icon?: ReactNode | string;
	iconRight?: ReactNode | string;
	shadow?: boolean;
	iconError?: boolean;
	text: ReactNode | string;
	iconColorBg?: string;
	hoverColor?: string;
	onClick?: () => void;
	className?: string;
	rounded?: boolean;
}

export const TextCard = (props: TextCardProps) => {
	const {
		className,
		hoverColor,
		shadow,
		onClick,
		icon,
		iconRight,
		rounded,
		text,
		iconColorBg = "pr-c-green1",
	} = props;
	const [isImgError, setIsImgError] = useState(false);

	const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
		event.currentTarget.onerror = null;
		setIsImgError(true);
	};

	const iconLocal =
		typeof icon === "string" ? (
			<img
				onError={handleImageError}
				src={icon}
				className={`h-base w-base rounded-sm bg-${iconColorBg}`}
			/>
		) : icon && isImgError === true ? (
			<div className="h-base w-base rounded-sm bg-pr-c-blue1 flex justify-center items-center">
				<StopCircleIcon className="h-min3 text-neutral-c-400" />
			</div>
		) : icon ? (
			<>{icon}</>
		) : (
			<></>
		);

	const iconRightLocal =
		typeof iconRight === "string" ? (
			<img
				onError={handleImageError}
				src={iconRight}
				className={`h-base w-base rounded-sm bg-${iconColorBg}`}
			/>
		) : iconRight && isImgError === true ? (
			<div className="h-base w-base rounded-sm bg-pr-c-blue1 flex justify-center items-center">
				<StopCircleIcon className="h-min3 text-neutral-c-400" />
			</div>
		) : (
			<>{iconRight}</>
		);

	return (
		<div
			onClick={onClick}
			className={cx(
				"bg-white flex gap-min2 items-center  h-base+ whitespace-nowrap p-min2",
				onClick && "cursor-pointer",
				hoverColor && "hover:bg-" + hoverColor,
				rounded ? "rounded-full" : "rounded-base",
				shadow && "shadow",
				className && className,
			)}
		>
			{iconLocal}
			{<Body3>{text}</Body3>}
			{iconRightLocal}
		</div>
	);
};
