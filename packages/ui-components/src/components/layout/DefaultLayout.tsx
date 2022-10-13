import React, { ReactChild, ReactNode } from "react";
import { NavButton, NavButtonProps } from "../buttons";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
// import { constants } from 'ethers'

export type NavItem = Pick<NavButtonProps, "route" | "icon" | "label">;

export interface DefaultSidebarProps extends Pick<NavButtonProps, "onRoute"> {
	title: string;
	navItems: NavItem[];
	isActiveRoute: (route: string) => boolean;
	connectionButton?: ReactNode;
}

export interface DefaultLayoutProps extends Omit<DefaultSidebarProps, "navItems"> {
	children: ReactChild | ReactChild[];
}

export const DefaultSidebar = ({
	title,
	onRoute,
	isActiveRoute,
	navItems,
	connectionButton,
}: DefaultSidebarProps) => {
	return (
		<aside className="flex flex-col w-full h-full items-center justify-between bg-white">
			<div className="w-full">
				{/* Header */}
				<div className="cursor-pointer border-b px-4">
					<div className="w-full flex items-center justify-start gap-2 py-8">
						<img className="w-12" src="/logo.svg" />
						<h3>{title}</h3>
					</div>
				</div>
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
	);
};

const navItems = [
	{
		route: "/agreements",
		icon: <PencilSquareIcon className="w-5 h-5" />,
		label: "Agreements",
	},
];

export const DefaultLayout = ({ children, connectionButton, ...props }: DefaultLayoutProps) => {
	return (
		<div className="mx-auto">
			<div className="flex w-screen bg-gray-50">
				<div className="flex flex-col w-72 h-screen items-center justify-center">
					<DefaultSidebar navItems={navItems} connectionButton={connectionButton} {...props} />
				</div>
				<div className="flex flex-col w-full h-screen items-center justify-center">{children}</div>
			</div>
		</div>
	);
};
