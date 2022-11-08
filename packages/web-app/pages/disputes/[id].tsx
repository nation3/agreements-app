import { Card, BackLinkButton, Button } from "@nation3/ui-components";
import { useRouter } from "next/router";
import { AgreementDetails, AgreementDataProvider } from "../../components/agreement";
import {
	useResolution,
	useResolutionExecute,
	useResolutionSubmit,
} from "../../hooks/useArbitrator";

import { useAgreementData } from "../../components/agreement/context/AgreementDataContext";
import { Table, TokenBalanceInput, utils as n3utils } from "@nation3/ui-components";
import { BigNumber, utils } from "ethers";
import { ChangeEvent, FocusEvent, useEffect, useMemo, useState } from "react";
import { frameworkAddress } from "../../lib/constants";
import keccak256 from "keccak256";

// TODO: Move to utils
const purgeFloat = (number: string, config?: { units?: number; strip?: boolean }) => {
	const maxDecimals = config?.units ?? 18;
	const purged = number
		.replace(/[^0-9,.]/g, "")
		.replace(/,/g, ".")
		.replace(new RegExp(`^(\\d*(\\.\\d{0,${maxDecimals}})?)\\d*$`, "g"), "$1");

	return config?.strip ? purged.replace(/\.$/g, "") : purged;
};

const Settlement = () => {
	const { id: agreementId, positions } = useAgreementData();
	const {
		submit,
		isLoading: submissionLoading,
		isProcessing: submissionProcessing,
	} = useResolutionSubmit();
	const {
		execute,
		isLoading: executionLoading,
		isProcessing: executionProcessing,
	} = useResolutionExecute();

	const [settlement, setSettlement] = useState<{ party: string; balance: BigNumber }[]>();
	const [targetBalance, setTargetBalance] = useState<BigNumber>();

	const currentMark = useMemo(() => {
		if (settlement) {
			return utils.hexlify(
				Buffer.from(
					keccak256(
						utils.defaultAbiCoder.encode(["tuple (address party,uint256 balance)[]"], [settlement]),
					).toString("hex"),
					"hex",
				),
			);
		}
	}, [settlement]);

	const resolutionId = useMemo(() => {
		console.log(agreementId);
		if (agreementId != "undefined") {
			return utils.hexlify(
				Buffer.from(
					keccak256(
						utils.solidityPack(["address", "bytes32"], [frameworkAddress, agreementId]),
					).toString("hex"),
					"hex",
				),
			);
		}
	}, [agreementId]);

	const { resolution } = useResolution({
		id: String(resolutionId),
		enabled: resolutionId != "undefined",
	});

	useEffect(() => {
		const defaultSettlement = Object.entries(positions ?? {})
			.filter(([, { status }]) => status > 0)
			.map(([account, { balance }]) => ({ party: account, balance: BigNumber.from(balance) }));
		const totalBalance = defaultSettlement.reduce(
			(result, { balance }) => result.add(balance),
			BigNumber.from(0),
		);

		setSettlement(defaultSettlement);
		setTargetBalance(totalBalance);
	}, [positions]);

	const updateBalance = (index: number, balance: string) => {
		const newSettlement = JSON.parse(JSON.stringify(settlement));
		newSettlement[index].balance = balance
			? utils.parseUnits(balance)
			: newSettlement[index].balance;
		setSettlement(newSettlement);
	};

	const currentBalance = useMemo(() => {
		return settlement?.reduce((result, { balance }) => result.add(balance), BigNumber.from(0));
	}, [settlement]);

	const isValidSettlement = useMemo(() => {
		if (targetBalance && currentBalance) {
			return currentBalance.eq(targetBalance);
		}
		return false;
	}, [targetBalance, currentBalance]);

	const canExecute = useMemo(() => {
		if (["Pending", "Endorsed"].includes(resolution?.status || "undefined"))
			return currentMark == resolution?.mark;
		return false;
	}, [currentMark, resolution]);

	return (
		<div className="flex flex-col gap-1">
			{resolution?.status == "Pending" && (
				<>
					<div className="flex flex-col">
						<span>Resolution pending for execution with fingerprint:</span>
						<span>{resolution?.mark}</span>
					</div>
					<div>Execution unlocks at block: {resolution.unlockBlock}</div>
				</>
			)}
			{resolution?.status == "Endorsed" && (
				<>
					<div>Resolution is endorsed, can be executed anytime.</div>
				</>
			)}
			{resolution?.status == "Appealed" && (
				<>
					<div>Resolution has been appealed.</div>
				</>
			)}
			{resolution?.status == "Executed" && (
				<>
					<div>Resolution has been executed.</div>
				</>
			)}
			{resolution?.status != "Executed" && (
				<>
					<div className="flex flex-col content-end text-right">
						<span>Current mark:</span>
						<span>{currentMark}</span>
						<div>
							Balance mismatch: {utils.formatUnits(targetBalance?.sub(currentBalance ?? 0) ?? 0)}
						</div>
					</div>
					<Table
						columns={["participant", "stake"]}
						data={
							settlement?.map(({ party, balance }, index) => [
								n3utils.shortenHash(party),
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
					{canExecute ? (
						<Button
							label="Execute"
							disabled={executionLoading || executionProcessing || !canExecute}
							isLoading={executionLoading || executionProcessing}
							onClick={() => {
								execute({
									framework: frameworkAddress,
									id: agreementId,
									settlement: settlement || [],
								});
							}}
						/>
					) : (
						<Button
							label="Submit"
							disabled={submissionLoading || submissionProcessing || !isValidSettlement}
							isLoading={submissionLoading || submissionProcessing}
							onClick={() => {
								submit({
									framework: frameworkAddress,
									id: agreementId,
									metadata: "",
									settlement: settlement || [],
								});
							}}
						/>
					)}
				</>
			)}
		</div>
	);
};

const DisputePage = () => {
	const router = useRouter();
	const { query } = router;

	return (
		<div className="w-full max-w-2xl">
			<AgreementDataProvider id={String(query.id)}>
				<BackLinkButton route={"/disputes"} label={"Go back to disputes"} onRoute={router.push} />
				<Card className="flex flex-col gap-8 w-full text-gray-800">
					<AgreementDetails />
					<Settlement />
				</Card>
			</AgreementDataProvider>
		</div>
	);
};

export default DisputePage;
