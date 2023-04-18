import { Button, Table, TokenBalanceInput } from "@nation3/ui-components";
import React, { useState, useMemo, ChangeEvent, FocusEvent } from "react";
import { utils, BigNumber } from "ethers";

import { useDispute, Position } from "./context/DisputeResolutionContext";
import { arbitratorInterface } from "../../hooks/useArbitrator";
import { useCohort } from "../../hooks/useCohort";
import { purgeFloat, generateResolutionMetadata } from "../../utils";
import { preparePutToIPFS } from "../../lib/ipfs";

import { AccountDisplay } from "../AccountDisplay";
import { useConstants } from "../../hooks/useConstants";
import { Card } from "@nation3/ui-components";
import { BodyHeadline } from "@nation3/ui-components";

export const ResolutionForm = () => {
	const { dispute } = useDispute();
	const { propose } = useCohort();
	const [settlement, setSettlement] = useState<Position[]>(dispute.positions ?? []);
	const { frameworkAddress } = useConstants();

	const settlementBalance = useMemo(() => {
		return settlement?.reduce((result, { balance }) => result.add(balance), BigNumber.from(0));
	}, [settlement]);

	const isValidSettlement = useMemo(() => {
		if (dispute.balance && settlementBalance) {
			return settlementBalance.eq(dispute.balance);
		}
		return false;
	}, [dispute.balance, settlementBalance]);

	const submit = async () => {
		const metadata = generateResolutionMetadata(settlement ?? []);

		const { put, cid } = await preparePutToIPFS(metadata);
		const metadataURI = `ipfs://${cid}`;

		const data = arbitratorInterface.encodeFunctionData("submitResolution", [
			frameworkAddress,
			dispute.id,
			metadataURI,
			settlement || [],
		]);

		propose(data)
			.then(async () => {
				await put();
				window.location.reload();
			})
			.catch((error) => console.log(error));
	};

	const updateBalance = (index: number, balance: string) => {
		if (!settlement) return;
		const newSettlement = settlement.map((position) => ({ ...position }));
		newSettlement[index].balance = balance
			? utils.parseUnits(balance)
			: newSettlement[index].balance;
		setSettlement(newSettlement);
	};

	return (
		<Card className="">
			<div>
				<BodyHeadline className="mb-base">Settlement proposal</BodyHeadline>
				<div className="border-2 border-neutra-c-200 rounded-full my-min3"></div>
			</div>
			<Table
				columns={["participant", "stake"]}
				data={
					settlement?.map(({ party, balance }, index) => [
						<AccountDisplay key={index} address={party} />,
						<TokenBalanceInput
							key={index}
							defaultValue={utils.formatUnits(balance)}
							token={dispute.collateralToken?.symbol ?? ""}
							onChange={(e: ChangeEvent<HTMLInputElement>) => {
								const purged = purgeFloat(e.target.value);
								if (parseFloat(purged) < 0) return;
								e.target.value = purged;
							}}
							onBlur={(e: FocusEvent<HTMLInputElement>) => {
								if (!e.target.value) {
									e.target.value = e.target.placeholder;
								}
								updateBalance(index, purgeFloat(e.target.value, { strip: true }));
							}}
						/>,
					]) || []
				}
			/>
			<Button label="Propose" disabled={!isValidSettlement} onClick={() => submit()} />
		</Card>
	);
};
