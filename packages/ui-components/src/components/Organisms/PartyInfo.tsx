// PartyInfo.tsx
import cx from "classnames";
import { BigNumber } from "ethers";
import React from "react";
import { UserIcon } from "../../icons";
import { Body2, Body3 } from "../Atoms";
import { AccountDisplay } from "../Molecules/YourAccountHandler";

interface PartyInfoProps {
	account: string;
	balance: BigNumber;
	token: {
		symbol: string;
	} | null;
	color: string;
	myAccount: string;
}

const PartyInfo: React.FC<PartyInfoProps> = ({ account, balance, token, color, myAccount }) => (
	<div className={cx("mb-base last:mb-0 p-min3 w-full rounded-md", `bg-${color}`)}>
		<section className="grid grid-cols-5 md:gap-16 gap-8">
			<div className="col-start-1 col-end-6 md:col-end-4 flex">
				<Body3 className="text-neutral-c-500 mb-min2">Address</Body3>
				<div className="flex">
					<AccountDisplay address={account} />
					{myAccount === account && (
						<div className="flex rounded ml-min3">
							<UserIcon className="h-base" />
							<Body2 className="ml-min2">You</Body2>
						</div>
					)}
				</div>
			</div>
			<div className="col-start-1 col-end-3 md:col-start-4 md:col-end-4">
				<Body3 className="text-neutral-c-500 mb-min2">Collateral</Body3>
				<Body3>{BigNumber.from(balance).toString()}</Body3>
			</div>
			<div className="col-start-4 col-end-6 md:col-start-5 md:col-end-5">
				<Body3 className="text-neutral-c-500 mb-min2">Token</Body3>
				<Body3>{token?.symbol ?? ""}</Body3>
			</div>
		</section>
	</div>
);

export default PartyInfo;
