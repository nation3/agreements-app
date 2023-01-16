import React from "react";
import { ReactNode } from "react";
import Nation3Logo from "../Atoms/Nation3Logo";
import AppHeader from "../Molecules/AppHeader";
import { NavButton, NavButtonProps } from "../Molecules/buttons";

export type NavItem = Pick<NavButtonProps, "route" | "icon" | "label">;

export interface SideBarProps extends Pick<NavButtonProps, "onRoute"> {
	title: string;
	appName: string;
	navItems: NavItem[];
	isActiveRoute: (route: string) => boolean;
	connectionButton?: ReactNode;
}

export const SideNav = ({
	title,
	appName,
	onRoute,
	isActiveRoute,
	navItems,
	connectionButton,
}: SideBarProps) => {
	return (
		<div className="flex flex-col w-72 h-screen items-center justify-center">
			<aside className="flex flex-col w-full h-full items-center justify-between bg-white">
				<div className="w-full">
					{/* Header */}
					<AppHeader title={title} appName={appName} />
					{/* Nav */}
					<div className="px-4">
						{navItems.map((item) => (
							<NavButton
								key={item.label}
								{...item}
								onRoute={onRoute}
								isActive={isActiveRoute?.(item.route)}
							/>
						))}
					</div>
				</div>
				{/* Footer */}
				<div className="w-full p-4">{connectionButton}</div>
			</aside>
		</div>
	);
};
