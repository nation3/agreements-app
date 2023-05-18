import { StopCircleIcon } from "@heroicons/react/24/solid";
import cx from "classnames";
import React, { ReactNode, useState } from "react";
import { Body3 } from "../Atoms";

interface TextCardProps {
	icon?: ReactNode | string;
	iconRight?: boolean;
	shadow?: boolean;
	iconError?: boolean;
	text: ReactNode | string;
	iconColorBg?: string;
	onClick?: () => void;
	className?: string;
}

export const TextCard = (props: TextCardProps) => {
	const { className, shadow, onClick, icon, iconRight, text, iconColorBg = "pr-c-green1" } = props;
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
				width={24}
				height={24}
				className={`h-base w-base rounded-sm bg-${iconColorBg}`}
			/>
		) : isImgError === true ? (
			<>
				<div className="h-base w-base rounded-sm bg-pr-c-blue1 flex justify-center items-center">
					{/* {isLoading && <IconLoader src={} />} */}
					<StopCircleIcon className="h-min3 text-neutral-c-400" />
				</div>
			</>
		) : (
			<>{icon}</>
		);

	return (
		<div
			onClick={onClick}
			className={cx(
				"bg-white flex gap-min1 items-center rounded-base h-base+ whitespace-nowrap p-min2",
				onClick && "cursor-pointer",
				shadow && "shadow",
				className && className,
			)}
		>
			{icon && !iconRight && <>{iconLocal}</>}
			{<Body3>{text}</Body3>}
			{iconRight && <>{iconLocal}</>}
		</div>
	);
};
