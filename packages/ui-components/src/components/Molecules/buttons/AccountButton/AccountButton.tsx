import React, { ReactNode } from "react";
import { ScreenType, useScreen } from "../../../../hooks/useScreen";
import { N3User } from "../../../../icons";
import { shortenHash } from "../../../../utils/strings";
import { IconRenderer } from "../../../Atoms";
import { TextCard } from "../../TextCard";

export interface AccountButtonProps {
	avatar?: ReactNode;
	account: { address: string; ensName?: string };
	borderColor?: string;
}

export const AccountButton = ({ avatar, account, borderColor, ...props }: AccountButtonProps) => {
	const { screen } = useScreen();
	return (
		<div {...props}>
			<div className="flex items-center gap-min3">
				<TextCard
					shadow
					rounded={screen == ScreenType.Mobile}
					icon={<IconRenderer icon={<N3User />} backgroundColor={"pr-c-green1"} size={"xs"} />}
					text={account.ensName ? account.ensName : shortenHash((account.address as string) ?? "")}
				></TextCard>
				<div
					className={`flex justify-center items-center overflow-hidden rounded-full h-base w-base md:h-[50px] md:w-[50px] border-2 border-${
						borderColor ? borderColor : "neutral-c-500"
					}`}
				>
					{avatar}
				</div>
			</div>
		</div>
	);
};
