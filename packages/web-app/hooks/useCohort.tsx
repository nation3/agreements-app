import { SafeTransaction } from "@safe-global/safe-core-sdk-types";
import Safe from "@safe-global/safe-core-sdk";
import { SafeMultisigConfirmationResponse } from "@safe-global/safe-core-sdk-types";
import SafeServiceClient from "@safe-global/safe-service-client";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { useEffect, useState } from "react";
import { ethers, Signer, BigNumber, constants } from "ethers";
import { useAccount, useSigner } from "wagmi";
import { ResolutionInput } from "./useArbitrator";
import { useConstants } from "./useConstants";

export type ResolutionProposal = {
	txHash: string;
	txNonce: number;
	confirmationsRequired: number;
	confirmations: SafeMultisigConfirmationResponse[];
	resolution: ResolutionInput;
};

const useSafe = ({
	safeAddress,
	signer,
	txServiceUrl,
}: {
	safeAddress: string;
	signer: Signer | undefined;
	txServiceUrl: string;
}) => {
	const [safeSDK, setSafeSDK] = useState<Safe>();
	const [safeServiceClient, setSafeServiceClient] = useState<SafeServiceClient>();

	useEffect(() => {
		if (signer) {
			const ethAdapter = new EthersAdapter({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				ethers,
				signerOrProvider: signer,
			});

			Safe.create({ ethAdapter, safeAddress }).then((safe) => {
				setSafeSDK(safe);
			});

			setSafeServiceClient(
				new SafeServiceClient({
					txServiceUrl,
					ethAdapter,
				}),
			);
		}
	}, [signer]);

	return { safeSDK, safeServiceClient };
};

export const useCohort = () => {
	const { arbitratorAddress, cohortAddress, safeTxServiceUrl } = useConstants();
	const safeAddress = cohortAddress;
	const [judges, setJudges] = useState<string[]>();
	const { data: signer } = useSigner();
	const { address: senderAddress } = useAccount();
	const { safeSDK, safeServiceClient } = useSafe({
		safeAddress,
		signer: signer as Signer,
		txServiceUrl: safeTxServiceUrl,
	});

	useEffect(() => {
		safeSDK?.getOwners().then((owners) => {
			if (owners != judges) setJudges(owners);
		});
	}, [safeSDK]);

	const proposeTransaction = async (safeTransaction: SafeTransaction) => {
		if (!senderAddress || !safeSDK || !safeServiceClient) return;

		const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
		const senderSignature = await safeSDK.signTransactionHash(safeTxHash);
		await safeServiceClient.proposeTransaction({
			safeAddress,
			safeTxHash,
			safeTransactionData: safeTransaction.data,
			senderAddress,
			senderSignature: senderSignature.data,
			origin: "Nation3 Judge App",
		});
	};

	const propose = async (data: string) => {
		if (!senderAddress || !safeSDK || !safeServiceClient) return;

		const safeNextNonce = await safeServiceClient.getNextNonce(cohortAddress);
		const safeTransaction = await safeSDK.createTransaction({
			safeTransactionData: {
				to: arbitratorAddress,
				value: "0",
				data: data,
				operation: 0,
				nonce: safeNextNonce,
			},
		});
		await proposeTransaction(safeTransaction);
	};

	const approve = async (txHash: string) => {
		if (!safeSDK || !safeServiceClient) return;

		const signature = await safeSDK.signTransactionHash(txHash);
		await safeServiceClient.confirmTransaction(txHash, signature.data);
	};

	const reject = async (txNonce: number) => {
		if (!senderAddress || !safeSDK || !safeServiceClient) return;

		const safeTransaction = await safeSDK.createRejectionTransaction(txNonce);
		await proposeTransaction(safeTransaction);
	};

	const execute = async (txHash: string) => {
		if (!safeSDK || !safeServiceClient) return;

		const safeTransaction = await safeServiceClient.getTransaction(txHash);
		await safeSDK.executeTransaction(safeTransaction);
	};

	return { judges, propose, approve, reject, execute };
};

type SafeDecodedParameters = { name: string; type: string; value: any }[];

export const useResolutionProposals = ({ id }: { id: string }) => {
	const { cohortAddress, safeTxServiceUrl } = useConstants();
	const { data: signer } = useSigner();
	const { safeServiceClient } = useSafe({
		safeAddress: cohortAddress,
		signer: signer as Signer,
		txServiceUrl: safeTxServiceUrl,
	});

	const [proposals, setProposals] = useState<ResolutionProposal[]>();

	const fetchProposalForDispute = async (id: string) => {
		if (!safeServiceClient) return;

		const pendingTransactions = await safeServiceClient.getPendingTransactions(cohortAddress);
		// Filter transactions that start with `submitResolution` on the payload
		const proposals = pendingTransactions.results
			.filter((tx) => tx.data?.startsWith("0x02fd597d"))
			.map(({ safeTxHash, nonce, confirmationsRequired, confirmations, dataDecoded }) => {
				// dataDecoded has (string | undefined) as typing when in this case should be (object | undefined)
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const parameters: SafeDecodedParameters = dataDecoded.parameters ?? [];
				const resolutionParams: { [key: string]: any } = parameters.reduce(
					(result, { name, value }) => {
						return { ...result, [name]: value };
					},
					{},
				);
				return {
					txHash: safeTxHash,
					txNonce: nonce,
					confirmationsRequired,
					confirmations: confirmations ?? [],
					resolution: {
						framework: resolutionParams.framework ?? constants.AddressZero,
						dispute: resolutionParams.dispute ?? constants.AddressZero,
						settlement: (resolutionParams.settlement as [string, string][]).map(
							([party, balance]) => ({ party, balance: BigNumber.from(balance) }),
						),
					},
				};
			})
			.filter(({ resolution }) => resolution.dispute === id);
		setProposals(proposals);
	};

	useEffect(() => {
		fetchProposalForDispute(id);
	}, [safeServiceClient, id]);

	return { proposals };
};
