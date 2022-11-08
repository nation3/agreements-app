import React, { ReactNode, useEffect, useState } from "react";
import { ButtonBase, NavButton, NavButtonProps } from "../buttons";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { Bars3Icon } from "@heroicons/react/24/solid";
// import { constants } from 'ethers'

enum ScreenType {
	Mobile,
	Desktop,
}

const reportScreen: () => ScreenType = () => {
	if (typeof window !== "undefined") {
		const w = window.innerWidth;
		if (w < 1024) {
			return ScreenType.Mobile;
		}
	}
	return ScreenType.Desktop;
};

export const useScreen = () => {
	const [screen, setScreen] = useState(reportScreen());

	useEffect(() => {
		const handleChange = () => {
			setScreen(reportScreen());
		};

		window.addEventListener("resize", handleChange);

		return () => {
			window.removeEventListener("resize", handleChange);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { screen };
};

export type NavItem = Pick<NavButtonProps, "route" | "icon" | "label">;

export interface NavBarProps extends Pick<NavButtonProps, "onRoute"> {
	title: string;
	navItems: NavItem[];
	isActiveRoute: (route: string) => boolean;
	connectionButton?: ReactNode;
}

export interface DefaultLayoutProps extends Omit<NavBarProps, "navItems"> {
	children: ReactNode;
}

export const SideNav = ({
	title,
	onRoute,
	isActiveRoute,
	navItems,
	connectionButton,
}: NavBarProps) => {
	return (
		<div className="flex flex-col w-72 h-screen items-center justify-center">
			<aside className="flex flex-col w-full h-full items-center justify-between bg-white">
				<div className="w-full">
					{/* Header */}
					<div className="cursor-pointer border-b px-4">
						<div className="w-full flex items-center justify-start gap-2 py-8">
							<img className="w-16" src="/logo.svg" />
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
		</div>
	);
};

export const BottonNav = ({ connectionButton }: NavBarProps) => {
	return (
		<div className="flex flex-col fixed left-0 bottom-0 w-full">
			<nav className="flex justify-between items-center p-2 bg-gray-50">
				<div className="flex flex-1 flex-col items-start">
					<NavMenuButton />
				</div>
				<div className="flex flex-1 flex-col items-center">
					<img className="w-14" src="/logo.svg" />
				</div>
				<div className="flex flex-1 flex-col items-end">{connectionButton}</div>
			</nav>
		</div>
	);
};

const navItems = [
	{
		route: "/agreements",
		icon: <PencilSquareIcon className="w-5 h-5" />,
		label: "Agreements",
	},
];

export const NavBar = ({ ...props }: NavBarProps) => {
	const { screen } = useScreen();

	if (screen == ScreenType.Desktop) {
		return <SideNav {...props} />;
	}
	return <BottonNav {...props} />;
};

const NavMenuButton = () => {
	return (
		<div className="w-fit">
			<ButtonBase className="p-4 bg-white">
				<Bars3Icon className="w-8 h-8" />
			</ButtonBase>
		</div>
	);
};

export const DefaultLayout = ({ children, ...props }: DefaultLayoutProps) => {
	return (
		<div className="mx-auto">
			<div className="flex">
				<NavBar navItems={navItems} {...props} />
				<div className="grow flex flex-col min-h-screen items-center px-4 pt-2 pb-24 lg:pt-4 lg:pb-4 justify-center">
					{children}
				</div>
			</div>
		</div>
	);
};
