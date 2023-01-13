import React from "react";
import { useState, useEffect, ReactNode } from "react";
import { NavMenuButton } from "../components/buttons/NavMenuButton";
import Nation3Logo from "../components/svgs/Nation3Logo";

type IBottomNavProps = {
	connectionButton?: ReactNode;
};

const IBottomNavDefaultProps = {};

const BottomNav: React.FC<IBottomNavProps> = (props) => {
	const { connectionButton } = props;

	return (
		<React.Fragment>
			<div className="flex flex-col fixed left-0 top-0 w-full">
				<nav className="px-2 flex w-full justify-between items-center p-2">
					{/* 					<div className="flex flex-1 flex-col items-start">
						<NavMenuButton />
					</div> */}
					<div className="w-12">
						<Nation3Logo />
					</div>
					<div className="flex flex-col justify-center text-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
						<p className="text-lg text-slate-800 font-bold">Court</p>
						<p className="text-xs text-slate-500">Nation3</p>
					</div>
					{connectionButton && <div className="flex  flex-col items-end">{connectionButton}</div>}
				</nav>
			</div>
		</React.Fragment>
	);
};

BottomNav.defaultProps = IBottomNavDefaultProps;

export default BottomNav;
