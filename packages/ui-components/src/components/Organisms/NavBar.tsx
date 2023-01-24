import React from "react";
import { ScreenType, useScreen } from "../../hooks/useScreen";
import BottonNav from "./BottomNav";
import { SideNav, SideBarProps } from "./SideNav";

export const NavBar = ({ ...props }: SideBarProps) => {
	const { screen } = useScreen();

	if (screen == ScreenType.Desktop) {
		return <SideNav {...props} />;
	}
	return <BottonNav {...props} />;
};
