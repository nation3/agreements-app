import React, { ReactNode } from "react";
import { shortenHash } from "../../../utils/strings";
import { ButtonBase, ButtonBaseProps } from "./Button";

export interface AccountButtonProps extends ButtonBaseProps {
	avatar: ReactNode;
	account: { address: string; ensName?: string };
}

export const AccountButton = ({ avatar, account, ...props }: AccountButtonProps) => {
	return (
		<ButtonBase {...props}>
			<div className="flex items-center gap-2 rounded-full">
				<span className="hidden md:inline">
					{account.ensName ? account.ensName : shortenHash((account.address as string) ?? "")}
				</span>
				{avatar}
			</div>
		</ButtonBase>
	);
};
