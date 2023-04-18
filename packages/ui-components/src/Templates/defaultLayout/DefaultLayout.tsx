import React, { ReactNode } from "react";
import { ScreenType, useScreen } from "../../hooks/useScreen";
import BottonNav from "../../components/Organisms/BottomNav";
import TopBar from "../../components/Organisms/TopBar";
import { NavButtonProps } from "../../components/Molecules/buttons";
import cx from "classnames";

export interface DefaultLayoutProps extends Omit<NavBarProps, "navItems"> {
	children: ReactNode;
}

export interface NavBarProps extends Pick<NavButtonProps, "onRoute"> {
	title: string;
	appName: string;
	isActiveRoute: (route: string) => boolean;
	navItems?: ReactNode;
	headerNavItems?: ReactNode;
	connectionButton?: ReactNode;
}

export const DefaultLayout = ({ children, ...props }: DefaultLayoutProps) => {
	const { title, appName, headerNavItems, connectionButton } = props;
	const { screen } = useScreen();

	const NavBar = () => {
		if (screen === ScreenType.Desktop) {
			return (
				<TopBar
					title={title}
					appName={appName}
					navItems={headerNavItems}
					connectionButton={connectionButton}
				/>
			);
			// return <SideNav {...props} />;
		}
		return <BottonNav connectionButton={connectionButton} />;
	};

	return (
		<div className="mx-auto">
			<div className="flex relative">
				<NavBar />
				<div className={cx("min-h-screen w-full")}>
					{/* 					<div
						className={cx()
						// screen === ScreenType.Desktop ? "pt-28" : "pt-24",
						// "w-full flex justify-center",
						}
					> */}
					{children}
					{/* </div> */}
				</div>
			</div>
		</div>
	);
};
