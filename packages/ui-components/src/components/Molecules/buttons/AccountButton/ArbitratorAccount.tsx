import React, { ReactNode } from "react";
import { GreenDownArrow, N3Arbitrator } from "../../../../icons";
import { shortenHash } from "../../../../utils";
import { IconRenderer } from "../../../Atoms";
import { TextCard } from "../../TextCard";

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
	return (
		<div {...props}>
			<div className="flex items-center gap-min3">
				<TextCard
					shadow
					icon={
						<IconRenderer icon={<N3Arbitrator />} backgroundColor={"pr-c-green1"} size={"xs"} />
					}
					iconRight={
						<IconRenderer icon={<GreenDownArrow />} backgroundColor={"white"} size={"xs"} />
					}
					text={account.ensName ? account.ensName : shortenHash((account.address as string) ?? "")}
				></TextCard>
				<div
					className={`flex justify-center items-center rounded-full h-base w-base md:h-[50px] md:w-[50px] border-2 border-${
						borderColor ? borderColor : "neutral-c-500"
					}`}
				>
					{avatar}
				</div>
			</div>
		</div>
	);
};
