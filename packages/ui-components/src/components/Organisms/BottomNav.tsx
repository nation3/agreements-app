import React from "react";
import { ReactNode } from "react";
import Nation3Logo from "../Atoms/Nation3Logo";
import Link from "next/link";

type IBottomNavProps = {
	connectionButton?: ReactNode;
};

const IBottomNavDefaultProps = {};

const BottomNav: React.FC<IBottomNavProps> = (props) => {
	const { connectionButton } = props;

	return (
		<React.Fragment>
			<div className="flex flex-col fixed left-0 top-0 w-full z-50">
				<nav className="px-2 flex w-full justify-between items-center p-2 bg-white border-b border-bluesky-100 h-18">
					{/* 					
					<div className="flex flex-1 flex-col items-start">
						<NavMenuButton />
					</div> */}
					<Link href={"/agreements"} className="w-12">
						<Nation3Logo />
					</Link>
					<div className="flex flex-col justify-center text-center opacity-50">
						<p className="text-lg text-slate-800 font-bold">Court</p>
						<p className="text-xs text-slate-500">Nation3</p>
					</div>
					{connectionButton && <div className="flex flex-col items-end">{connectionButton}</div>}
				</nav>
			</div>
		</React.Fragment>
	);
};

BottomNav.defaultProps = IBottomNavDefaultProps;

export default BottomNav;
