import React, { ReactNode } from "react";
import { ButtonBaseProps } from "../buttons/Button";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export interface NavButtonProps extends ButtonBaseProps {
	route: string;
	icon: ReactNode;
	label: string;
	onRoute: (href: string) => void;
	isActive: boolean;
}

export const NavButton = ({ route, icon, label, onRoute, isActive }: NavButtonProps) => {
	return (
		<div className="py-2 font-display">
			<a
				onClick={() => onRoute(route)}
				className={`flex items-center justify-between px-2 py-4 text-base rounded-lg cursor-pointer ${
					isActive ? "bg-bluesky-400 text-white" : "hover:bg-gray-200 text-gray-800"
				}`}
			>
				<div className="flex items-center">
					<div className="px-3">{icon}</div>
					{label}
				</div>
				<ChevronRightIcon className="w-5 h-5 opacity-50 right-4" />
			</a>
		</div>
	);
};
