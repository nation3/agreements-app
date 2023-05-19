import React, { ReactNode } from "react";
import { N3Arbitrator } from "../../../icons";
import { N3DisputeIcon } from "../../../icons/index";
import { shortenHash } from "../../../utils";
import { IconRenderer } from "../../Atoms";
import { DropdownTextCard } from "../DropdownTextCard";

export interface ArbitratorAccountButtonProps {
	avatar?: ReactNode;
	account: { address: string; ensName?: string };
	borderColor?: string;
}

export const ArbitratorAccountButton = ({
	avatar,
	account,
	borderColor,
	...props
}: ArbitratorAccountButtonProps) => {
	// TODO: Refactor menu
	const menu = [
		{
			name: "Disputes",
			link: "/disputes",
			icon: <IconRenderer icon={<N3DisputeIcon />} backgroundColor={"sc-c-orange1"} />,
		},
	];

	return (
		<div className="flex items-center gap-min3">
			<DropdownTextCard
				shadow
				icon={<IconRenderer icon={<N3Arbitrator />} backgroundColor={"pr-c-green1"} size={"xs"} />}
				text={account.ensName ? account.ensName : shortenHash((account.address as string) ?? "")}
				menuItems={menu}
			></DropdownTextCard>
			<div
				className={`flex justify-center items-center rounded-full h-base w-base md:h-[50px] md:w-[50px] border-2 border-${
					borderColor ? borderColor : "neutral-c-500"
				}`}
			>
				{avatar}
			</div>
		</div>
	);
};
