import { useSigner, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import SafeServiceClient, {
	SafeMultisigTransactionListResponse,
	SafeMultisigConfirmationResponse,
} from "@safe-global/safe-service-client";
import EthersAdapter from "@safe-global/safe-ethers-lib";

import arbitratorInterface from "../abis/Arbitrator.json";
import { arbitratorAddress, cohortAddress } from "../lib/constants";
import { useEffect, useMemo, useState } from "react";
import { ethers, BigNumber, constants } from "ethers";

const arbitratorAbi = arbitratorInterface.abi;

type ResolutionData = { status: string; mark: string; metadataURI: string; unlockBlock: number };

type ResolutionInput = {
	framework: string;
	id: string;
	settlement: { party: string; balance: BigNumber }[];
};

export type ResolutionProposal = {
	confirmationsRequired: number;
	confirmations: SafeMultisigConfirmationResponse[];
	resolution: ResolutionInput;
};

export const useResolution = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
	const { data: rawResolution, ...args } = useContractRead({
		addressOrName: arbitratorAddress,
		contractInterface: arbitratorAbi,
		functionName: "resolution",
		args: [id],
		enabled,
		onError(error) {
			console.log(error);
		},
	});

	const statusMessage = (resolutionStatus: number) => {
		switch (resolutionStatus) {
			case 0:
				return "Pending";
			case 1:
				return "Approved";
			case 2:
				return "Endorsed";
			case 3:
				return "Appealed";
			case 4:
				return "Executed";
			default:
				return "Unknown";
		}
	};

	const resolution: ResolutionData | undefined = useMemo(() => {
		if (rawResolution) {
			return {
				status: statusMessage(parseInt(rawResolution[0])),
				mark: String(rawResolution[1]),
				metadataURI: String(rawResolution[2]),
				unlockBlock: BigNumber.from(rawResolution[3]).toNumber(),
			};
		}
	}, [rawResolution]);

	return { resolution, ...args };
};

export const useResolutionSubmit = ({ onSettledSuccess }: { onSettledSuccess?: () => void }) => {
	const { write, data, ...args } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: arbitratorAddress,
		contractInterface: arbitratorAbi,
		functionName: "submitResolution",
		onSettled(data, error) {
			if (onSettledSuccess && data) {
				onSettledSuccess();
			}
			if (error) {
				console.log(error);
			}
		},
	});

	const { isLoading: isProcessing } = useWaitForTransaction({
		hash: data?.hash,
	});

	const submit = ({
		framework,
		id,
		metadataURI,
		settlement,
	}: ResolutionInput & { metadataURI: string }) => {
		write?.({
			recklesslySetUnpreparedArgs: [framework, id, metadataURI, settlement],
		});
	};

	return { submit, data, isProcessing, ...args };
};

export const useResolutionExecute = () => {
	const { write, data, ...args } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: arbitratorAddress,
		contractInterface: arbitratorAbi,
		functionName: "executeResolution",
		onError(error) {
			console.log(error);
		},
	});

	const { isLoading: isProcessing } = useWaitForTransaction({
		hash: data?.hash,
	});

	const execute = ({ framework, id, settlement }: ResolutionInput) => {
		write?.({
			recklesslySetUnpreparedArgs: [framework, id, settlement],
		});
	};

	return { execute, data, isProcessing, ...args };
};

export const useResolutionAppeal = () => {
	const { write, data, ...args } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: arbitratorAddress,
		contractInterface: arbitratorAbi,
		functionName: "appealResolution",
		onError(error) {
			console.log(error);
		},
	});

	const { isLoading: isProcessing } = useWaitForTransaction({
		hash: data?.hash,
	});

	const appeal = ({ id, settlement }: Pick<ResolutionInput, "id" | "settlement">) => {
		write?.({
			recklesslySetUnpreparedArgs: [id, settlement],
		});
	};

	return { appeal, data, isProcessing, ...args };
};

export const useResolutionProposals = ({ id }: { id: string }) => {
	const { data: signer } = useSigner();
	const [proposals, setProposals] = useState<ResolutionProposal[]>();

	useEffect(() => {
		if (signer) {
			const ethAdapter = new EthersAdapter({
				// @ts-ignore
				ethers,
				signerOrProvider: signer,
			});

			const safeService = new SafeServiceClient({
				txServiceUrl: "https://safe-transaction-goerli.safe.global",
				ethAdapter,
			});
			safeService
				.getPendingTransactions(cohortAddress)
				.then((pendingTxs: SafeMultisigTransactionListResponse) => {
					const proposals_ = pendingTxs.results
						.filter((tx) => tx.data?.startsWith("0x02fd597d"))
						.map((tx) => {
							// dataDecoded has (string | undefined) as typing when in this case should be (object | undefined)
							// @ts-ignore
							const data: { name: string; value: any }[] = tx.dataDecoded.parameters ?? [];
							return {
								confirmationsRequired: tx.confirmationsRequired,
								confirmations: tx.confirmations ?? [],
								resolution: {
									framework:
										String(data.find(({ name }) => name === "framework")?.value) ||
										constants.AddressZero,
									id:
										String(data.find(({ name }) => name === "id")?.value) || constants.AddressZero,
									settlement:
										data
											.find(({ name }) => name === "settlement")
											?.value.map(([party, balance]: [party: string, balance: string]) => ({
												party,
												balance: BigNumber.from(balance),
											})) || [],
								},
							};
						})
						.filter(({ resolution }) => resolution.id === id);
					// @ts-ignore
					setProposals(proposals_);
				});
		}
	}, [signer]);

	return { proposals };
};
