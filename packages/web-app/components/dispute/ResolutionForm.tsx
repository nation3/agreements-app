import { Button, Table, TokenBalanceInput, AddressDisplay } from "@nation3/ui-components";
import { useState, useMemo, ChangeEvent, FocusEvent } from "react";
import { utils, BigNumber } from "ethers";

import { useDispute, Position } from "./context/DisputeResolutionContext";
import { arbitratorInterface } from "../../hooks/useArbitrator";
import { useCohort } from "../../hooks/useCohort";
import { purgeFloat, generateResolutionMetadata } from "../../utils";
import { preparePutToIPFS } from "../../lib/ipfs";

import { useProvider } from "wagmi";
import { useConstants } from "../../hooks/useContants";

export const ResolutionForm = () => {
	const provider = useProvider({ chainId: 1 });
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
		<div className="flex flex-col gap-2">
			<div>
				<div className="text-md font-display">Settlement proposal</div>
				<div className="border-2 rounded-xl"></div>
			</div>
			<Table
				columns={["participant", "stake"]}
				data={
					settlement?.map(({ party, balance }, index) => [
						<AddressDisplay key={index} ensProvider={provider} address={party} />,
						<TokenBalanceInput
							key={index}
							defaultValue={utils.formatUnits(balance)}
							token={"NATION"}
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
		</div>
	);
};
