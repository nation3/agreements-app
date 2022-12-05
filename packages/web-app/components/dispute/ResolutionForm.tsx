import { Button, Table, TokenBalanceInput, AddressDisplay } from "@nation3/ui-components";
import { useState, useMemo, ChangeEvent, FocusEvent } from "react";
import { utils, BigNumber } from "ethers";

import { useDispute, Position } from "./context/DisputeResolutionContext";
import { useResolutionSubmit } from "../../hooks/useArbitrator";
import { purgeFloat, generateResolutionMetadata, ResolutionMetadata } from "../../utils";
import { preparePutToIPFS } from "../../lib/ipfs";

import { frameworkAddress } from "../../lib/constants";
import { useProvider } from "wagmi";

export const ResolutionForm = () => {
	const provider = useProvider({ chainId: 1 });
	const { dispute } = useDispute();
	const [metadata, setMetadata] = useState<ResolutionMetadata>();
	const [settlement, setSettlement] = useState<Position[]>(dispute.positions ?? []);

	const settlementBalance = useMemo(() => {
		return settlement?.reduce((result, { balance }) => result.add(balance), BigNumber.from(0));
	}, [settlement]);

	const isValidSettlement = useMemo(() => {
		if (dispute.balance && settlementBalance) {
			return settlementBalance.eq(dispute.balance);
		}
		return false;
	}, [dispute.balance, settlementBalance]);

	const uploadMetadataToIPFS = async () => {
		const { put } = await preparePutToIPFS(metadata ?? {});

		const cid = await put();
		console.log(`metadata uploaded to ${cid}`);
	};

	const {
		submit: submitResolution,
		isLoading: submissionLoading,
		isProcessing: submissionProcessing,
	} = useResolutionSubmit({ onSettledSuccess: uploadMetadataToIPFS });

	const submit = async () => {
		const metadata = generateResolutionMetadata(settlement ?? []);
		setMetadata(metadata);

		const { cid } = await preparePutToIPFS(metadata);
		const metadataURI = `ipfs://${cid}`;

		submitResolution({
			framework: frameworkAddress,
			id: dispute.id,
			metadataURI: metadataURI,
			settlement: settlement || [],
		});
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
		<>
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
			<Button
				label="Submit"
				disabled={submissionLoading || submissionProcessing || !isValidSettlement}
				isLoading={submissionLoading || submissionProcessing}
				onClick={() => submit()}
			/>
		</>
	);
};
