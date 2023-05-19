import { Body3, IllustrationRenderer, N3LogoGreen } from "@nation3/ui-components";
import Link from "next/link";
import React, { ReactNode } from "react";

type IBottomNavProps = {
	connectionButton?: ReactNode;
};

const IBottomNavDefaultProps = {};

const MobileNav: React.FC<IBottomNavProps> = (props) => {
	const { connectionButton } = props;

	return (
		<React.Fragment>
			<div className="flex flex-col fixed left-0 top-0 w-full z-50 m-min2">
				<nav className="flex w-full justify-between items-center border-2 bg-glass-c-50 border-glass-c-80 backdrop-blur-sm rounded-full p-min2 ">
					<Link href="/">
						{/* TODO:// Set here dropdown navigation */}
						<div className="cursor-pointer bg-white rounded-full shadow p-min flex gap-min2 items-center pr-min2">
							<IllustrationRenderer icon={<N3LogoGreen />} size={"xs"} />
							<Body3>Agreements</Body3>
						</div>
					</Link>
					{connectionButton && <div className="flex flex-col items-end">{connectionButton}</div>}
				</nav>
			</div>
		</React.Fragment>
	);
};

MobileNav.defaultProps = IBottomNavDefaultProps;

export default MobileNav;
