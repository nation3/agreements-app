import React from "react";
import { ButtonBase } from "../buttons";
import { Bars3Icon } from "@heroicons/react/24/solid";

export const NavMenuButton = () => {
	return (
		<div className="w-fit">
			<ButtonBase className="p-4 bg-white">
				<Bars3Icon className="w-8 h-8" />
			</ButtonBase>
		</div>
	);
};
