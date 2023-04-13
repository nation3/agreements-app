import React, { ReactNode } from "react";
import { shortenHash } from "../../../../utils/strings";
import { ButtonBase, ButtonBaseProps } from "../Button";
import { Body3 } from "../../../Atoms";

export interface AccountButtonProps extends ButtonBaseProps {
	avatar?: ReactNode;
	account: { address: string; ensName?: string };
	color?: string;
}

export const AccountButton = ({ avatar, account, color }: AccountButtonProps) => {
	return (
		<div>
			<div className="flex items-center gap-base">
				<Body3 className="hidden md:inline bg-white rounded shadow px-min2 py-min1">
					{account.ensName ? account.ensName : shortenHash((account.address as string) ?? "")}
				</Body3>
				<div
					className={`rounded-full h-[50px] w-[50px] border-2 border-${
						color ? color : "neutral-c-500"
					}`}
				>
					{avatar}
				</div>
			</div>
		</div>
	);
};
