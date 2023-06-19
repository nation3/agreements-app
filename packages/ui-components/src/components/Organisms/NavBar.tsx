import React from "react";

import { ThemedIconRenderer, Body3 } from "../atoms";
import { Handler, RoundedHandler } from "../molecules";
import { FullOrbIcon, AgreementIcon, DropdownIcon } from "../../icons";

interface NavBarProps {}

// FIXME: Right now the NavBar is just a placeholder, but it should be a real interactive component
const NavBar = ({}: NavBarProps) => {
	return (
		<nav id="navigation" className="flex items-center justify-center gap-4">
            <FullOrbIcon className="w-12 h-12 fill-primary-green rounded-full transition-all" />
			<div className="flex bg-primary-green-200 rounded">
				{/* <Link href="/agreements"> */}
                <Handler primaryIcon={AgreementIcon} actionIcon={DropdownIcon} disabled={true} theme="agreement">Agreements</Handler>
				{/* </Link> */}
				<div className="hidden md:flex items-center gap-16 px-[16px]">
					{/* <Link href="/agreements"> */}
						<Body3>My Agreements</Body3>
					{/* </Link> */}
				</div>
			</div>
		</nav>
	);
};

export default NavBar;