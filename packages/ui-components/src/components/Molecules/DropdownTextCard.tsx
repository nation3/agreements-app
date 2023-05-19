import cx from "classnames";
import { motion } from "framer-motion";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { GreenDownArrow } from "../../icons";
import { Body3, IconRenderer } from "../Atoms";
import { TextCard } from "./TextCard";

interface DropdownTextCardProps {
	icon?: ReactNode | string;
	iconRight?: ReactNode | string;
	shadow?: boolean;
	iconError?: boolean;
	text: ReactNode | string;
	iconColorBg?: string;
	onClick?: () => void;
	className?: string;
	menuItems: { name: string; link: string; icon?: ReactNode }[];
}

export const DropdownTextCard = (props: DropdownTextCardProps) => {
	const {
		className,
		shadow,
		onClick,
		icon,
		iconRight,
		text,
		iconColorBg = "pr-c-green1",
		menuItems,
	} = props;
	const [isImgError, setIsImgError] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
		event.currentTarget.onerror = null;
		setIsImgError(true);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const iconLocal =
		typeof icon === "string" ? (
			<img
				onError={handleImageError}
				src={icon}
				className={`h-base w-base rounded-sm bg-${iconColorBg}`}
			/>
		) : (
			icon && <>{icon}</>
		);

	const iconRightLocal =
		typeof iconRight === "string" ? (
			<img
				onError={handleImageError}
				src={iconRight}
				className={`h-base w-base rounded-sm bg-${iconColorBg}`}
			/>
		) : (
			<div onClick={() => setIsOpen(!isOpen)}>
				<IconRenderer
					icon={<GreenDownArrow />}
					backgroundColor={"white"}
					customSize={15}
					size={"xs"}
				/>
			</div>
		);
	return (
		<div
			ref={ref}
			onClick={onClick}
			className={cx(
				"bg-white flex gap-min1 items-center rounded-base h-base+ whitespace-nowrap p-min2 relative",
				onClick && "cursor-pointer",
				shadow && "shadow",
				className && className,
			)}
		>
			{iconLocal}
			{<Body3>{text}</Body3>}
			{iconRightLocal}

			{isOpen && (
				<motion.div
					className="absolute z-50 right-0 top-base+ mt-min2 rounded-base shadow-md bg-white ring-2 ring-neutral-c-300 overflow-hidden"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.15 }}
				>
					<div className="p-min2">
						{menuItems.map((item, index) => (
							<a className={`${item.icon && "flex"}`} href={item.link} role="menuitem" key={index}>
								<TextCard hoverColor={"neutral-c-200"} text={item.name} icon={item.icon} />
							</a>
						))}
					</div>
				</motion.div>
			)}
		</div>
	);
};
