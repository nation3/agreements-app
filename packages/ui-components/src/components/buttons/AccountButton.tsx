import React, { ReactNode } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { shortenHash } from "../../utils/strings";
import { ButtonBaseProps } from "./Button";
export { Account } from "../modals";
import { motion } from "framer-motion";

export interface AccountButtonProps extends ButtonBaseProps {
	avatar: ReactNode;
	account: { address: string; ensName?: string };
}

export const AccountButton = ({ avatar, account, ...props }: AccountButtonProps) => {
	return (
		<motion.button
			className="flex items-center justify-between w-full p-2 py-3 transition rounded-lg gap-1 text-base font-medium text-black bg-white cursor-pointer"
			whileTap={{ scale: 0.95 }}
			{...props}
		>
			<div className="flex items-center gap-3">
				{avatar}
				<span>
					{account.ensName ? account.ensName : shortenHash((account.address as string) ?? "")}
				</span>
			</div>
			<ChevronDownIcon className="w-5 h-5" />
		</motion.button>
	);
};
