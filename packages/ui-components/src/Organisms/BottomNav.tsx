import React from "react";
import { useState, useEffect, ReactNode } from "react";
import { NavMenuButton } from "../components/buttons/NavMenuButton";

type IBottomNavProps = {
	connectionButton?: ReactNode;
};

const IBottomNavDefaultProps = {};

const BottomNav: React.FC<IBottomNavProps> = (props) => {
	const { connectionButton } = props;

	return (
		<React.Fragment>
			<div className="flex flex-col fixed left-0 bottom-0 w-full">
				<nav className="flex justify-between items-center p-2 bg-gray-50">
					<div className="flex flex-1 flex-col items-start">
						<NavMenuButton />
					</div>
					<div className="flex flex-1 flex-col items-center">
						<img className="w-14" src="/logo.svg" />
					</div>
					{connectionButton && (
						<div className="flex flex-1 flex-col items-end">{connectionButton}</div>
					)}
				</nav>
			</div>
		</React.Fragment>
	);
};

BottomNav.defaultProps = IBottomNavDefaultProps;

export default BottomNav;
