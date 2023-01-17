import React, { ReactNode } from "react";
import { ScreenType, useScreen } from "../../hooks/useScreen";
import BottonNav from "../../components/Organisms/BottomNav";
import TopBar from "../../components/Organisms/TopBar";
import { NavButtonProps } from "../../components/Molecules/buttons";
import cx from "classnames";

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
		<div className="mx-auto bg-nation3-bg_grey">
			<div className="flex relative">
				<NavBar />
				<div
					className={cx(
						"grow flex min-h-screen w-full px-4 pt-2 pb-24 lg:pt-4 lg:pb-4 justify-center",
					)}
				>
					<div className={cx(screen === ScreenType.Desktop ? "pt-28" : "pt-24")}>{children}</div>
				</div>
			</div>
		</div>
	);
};
