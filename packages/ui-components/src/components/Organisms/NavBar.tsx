import React from "react";
import { ScreenType, useScreen } from "../../hooks/useScreen";
import BottonNav from "./BottomNav";
import { SideNav } from "./SideNav";
import { NavBarProps } from "../../Templates/defaultLayout/DefaultLayout";

export const NavBar = ({ ...props }: NavBarProps) => {
	const { screen } = useScreen();

	if (screen == ScreenType.Desktop) {
		// return <TopBar {...props} />;
		return <SideNav {...props} />;
	}
	return <BottonNav {...props} />;
};
