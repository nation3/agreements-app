import React, { ReactNode } from "react";
import { shortenHash } from "../../../../utils/strings";
import { Body3 } from "../../../Atoms";

export interface AccountButtonProps {
	avatar?: ReactNode;
	account: { address: string; ensName?: string };
	borderColor?: string;
}

export const AccountButton = ({ avatar, account, borderColor, ...props }: AccountButtonProps) => {
	return (
		<div {...props}>
			<div className="flex items-center gap-base">
				<Body3 className="hidden md:inline bg-white rounded shadow px-min2 py-min1">
					{account.ensName ? account.ensName : shortenHash((account.address as string) ?? "")}
				</Body3>
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
