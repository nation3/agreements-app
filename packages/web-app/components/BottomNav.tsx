import Nation3Logo from "@nation3/ui-components/src/components/Atoms/Nation3Logo";
import Link from "next/link";
import React, { ReactNode } from "react";

type IBottomNavProps = {
	connectionButton?: ReactNode;
	isArbitrator?: boolean;
};

const IBottomNavDefaultProps = {};

const BottomNav: React.FC<IBottomNavProps> = (props) => {
	const { connectionButton } = props;

	return (
		<React.Fragment>
			<div className="flex flex-col fixed left-0 top-0 w-full z-50">
				<nav className="flex w-full justify-between items-center border-2 bg-glass-c-50 border-glass-c-80 backdrop-blur-sm rounded-full p-min2 m-min2">
					<Link href={"/agreements"} className="w-base+">
						<Nation3Logo />
					</Link>
					{connectionButton && <div className="flex flex-col items-end">{connectionButton}</div>}
				</nav>
			</div>
		</React.Fragment>
	);
};

BottomNav.defaultProps = IBottomNavDefaultProps;

export default BottomNav;
