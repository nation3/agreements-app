import {
	useAccount,
	useSigner,
	useContractRead,
	useContractWrite,
	useWaitForTransaction,
} from "wagmi";
import Safe from "@safe-global/safe-core-sdk";
import SafeServiceClient, {
	SafeMultisigTransactionListResponse,
	SafeMultisigConfirmationResponse,
} from "@safe-global/safe-service-client";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
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
	const { safeSDK, safeServiceClient } = useSafe();
	const arbitratorInterface = new ethers.utils.Interface(arbitratorAbi);
	const { address } = useAccount();
	const [data, setData] = useState({});
	const [isProcessing, setIsProcessing] = useState(false);

	const submit = async ({
		framework,
		id,
		metadataURI,
		settlement,
	}: ResolutionInput & { metadataURI: string }) => {
		if (!address || !safeSDK || !safeServiceClient) return;

		const data = arbitratorInterface.encodeFunctionData("submitResolution", [
			framework,
			id,
			metadataURI,
			settlement,
		]);
		const safeNextNonce = await safeServiceClient.getNextNonce(cohortAddress);
		const safeTransactionData: SafeTransactionDataPartial = {
			to: arbitratorAddress,
			value: "0",
			data: data,
			operation: 0,
			nonce: safeNextNonce,
		};
		const safeTransaction = await safeSDK.createTransaction({ safeTransactionData });
		const safeTransactionHash = await safeSDK.getTransactionHash(safeTransaction);
		const senderSignature = await safeSDK.signTransactionHash(safeTransactionHash);
		setIsProcessing(true);
		const tx = await safeServiceClient.proposeTransaction({
			safeAddress: cohortAddress,
			safeTxHash: safeTransactionHash,
			safeTransactionData: safeTransaction.data,
			senderAddress: address,
			senderSignature: senderSignature.data,
			origin: "Nation3 Judge app",
		});
		setIsProcessing(false);
	};

	return { submit, data, isProcessing };
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

const useSafe = () => {
	const { data: signer } = useSigner();
	const [safeSDK, setSafeSDK] = useState<Safe | undefined>();
	const [safeServiceClient, setSafeServiceClient] = useState<SafeServiceClient | undefined>();

	useEffect(() => {
		if (signer) {
			const ethAdapter = new EthersAdapter({
				// @ts-ignore
				ethers,
				signerOrProvider: signer,
			});

			Safe.create({ ethAdapter, safeAddress: cohortAddress }).then((safe) => {
				setSafeSDK(safe);
			});

			setSafeServiceClient(
				new SafeServiceClient({
					txServiceUrl: "https://safe-transaction-goerli.safe.global",
					ethAdapter,
				}),
			);
		}
	}, [signer]);
	return { safeSDK, safeServiceClient };
};

export const useResolutionProposals = ({ id }: { id: string }) => {
	const { safeServiceClient } = useSafe();
	const [proposals, setProposals] = useState<ResolutionProposal[]>();

	useEffect(() => {
		if (safeServiceClient) {
			safeServiceClient
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
	}, [safeServiceClient]);

	return { proposals };
};
