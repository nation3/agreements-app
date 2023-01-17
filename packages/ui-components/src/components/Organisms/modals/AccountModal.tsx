import React from "react";
import { Modal, ModalProps } from "./Modal";
import { UserIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { TransparentButton } from "../../Molecules/buttons/TransparentButton";

export interface Account {
	address: string;
	ensName?: string;
}

export interface AccountModalProps extends Omit<ModalProps, "children"> {
	account: Account;
	onDisconnect?: () => void;
}

export const AccountModal = ({ account, onDisconnect, ...props }: AccountModalProps) => {
	return (
		<Modal {...props}>
			<div className="flex flex-col gap-3">
				<h3>Account</h3>
				{/*
                <p className="p-4">Connected to {account.connector?.name}</p>
                */}

				<ul className="p-2 -m-2 menu bg-base-100 rounded-box">
					<li key="address">
						<a
							href={`https://etherscan.io/address/${account.address}`}
							rel="noreferrer noopener"
							target="_blank"
						>
							<TransparentButton>
								<UserIcon className="w-5 h-5" />
								<span>
									{account.ensName
										? account.ensName
										: `${((account.address as string) ?? "").substring(0, 6)}...${(
												(account.address as string) ?? ""
										  ).slice(-4)}`}
								</span>
							</TransparentButton>
						</a>
					</li>

					{onDisconnect && (
						<li key="logout">
							<TransparentButton onClick={() => onDisconnect()}>
								<ArrowRightOnRectangleIcon className="w-5 h-5" />
								<span>Log out</span>
							</TransparentButton>
						</li>
					)}
				</ul>
			</div>
		</Modal>
	);
};
