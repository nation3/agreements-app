import React, { ReactNode } from "react";
import { NavButtonProps } from "../buttons";
import { ScreenType, useScreen } from "../../hooks/useScreen";
import BottonNav from "../../Organisms/BottomNav";
import TopBar from "../../Organisms/TopBar";

export interface DefaultLayoutProps extends Omit<NavBarProps, "navItems"> {
	children: ReactNode;
}

export type NavItem = Pick<NavButtonProps, "route" | "icon" | "label">;

export interface NavBarProps extends Pick<NavButtonProps, "onRoute"> {
	title: string;
	appName: string;
	navItems: NavItem[];
	isActiveRoute: (route: string) => boolean;
	connectionButton?: ReactNode;
}
/* 
const navItems = [
	{
		route: "/agreements",
		icon: <PencilSquareIcon className="w-5 h-5" />,
		label: "Agreements",
	},
]; */

export const DefaultLayout = ({ children, ...props }: DefaultLayoutProps) => {
	const { title, appName, connectionButton } = props;
	const { screen } = useScreen();

	const NavBar = () => {
		if (screen === ScreenType.Desktop) {
			return <TopBar title={title} appName={appName} connectionButton={connectionButton} />;
			// return <SideNav {...props} />;
		}
		return <BottonNav connectionButton={connectionButton} />;
	};

	return (
		<div className="mx-auto bg-nation3-bg_light">
			<div className="flex relative">
				<NavBar />
				<div className="grow flex min-h-screen bg-nation3-bg_light w-full items-center px-4 pt-2 pb-24 lg:pt-4 lg:pb-4 justify-center">
					{children}
				</div>
			</div>
		</div>
	);
};
