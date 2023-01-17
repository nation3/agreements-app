import { BigNumber, utils } from "ethers";
import { useMemo } from "react";
import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import tokenInterface from "../abis/ERC20.json";
import frameworkInterface from "../abis/CollateralAgreementFramework.json";
import { Resolver } from "../utils/criteria";
import { frameworkAddress } from "../lib/constants";

const frameworkAbi = frameworkInterface.abi;
const tokenAbi = tokenInterface.abi;

export const useToken = ({
	address,
	account,
	enabled = true,
}: {
	address: string;
	account: string;
	enabled: boolean;
}) => {
	const { data: balance } = useContractRead({
		addressOrName: address,
		contractInterface: tokenAbi,
		functionName: "balanceOf",
		args: [account],
		enabled: enabled,
		watch: true,
	});

	const { data: allowance } = useContractRead({
		addressOrName: address,
		contractInterface: tokenAbi,
		functionName: "allowance",
		args: [account, frameworkAddress],
		enabled: enabled,
		watch: true,
	});

	const {
		write: approveToken,
		isLoading: approvalLoading,
		data: approvalTx,
	} = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: address,
		contractInterface: tokenAbi,
		functionName: "approve",
		overrides: {
			gasLimit: 52000,
		},
		onError(error) {
			console.log(error);
		},
	});

	const { isLoading: approvalProcessing } = useWaitForTransaction({
		hash: approvalTx?.hash,
	});

	const approve = ({ amount }: { amount: BigNumber }) => {
		approveToken?.({ recklesslySetUnpreparedArgs: [frameworkAddress, amount] });
	};

	return { balance, allowance, approve, approvalLoading, approvalProcessing };
};

export const useAgreementRead = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
	const { data: params } = useContractRead({
		addressOrName: frameworkAddress,
		contractInterface: frameworkAbi,
		functionName: "agreementParams",
		args: [id],
		enabled,
	});

	const { data: positions } = useContractRead({
		addressOrName: frameworkAddress,
		contractInterface: frameworkAbi,
		functionName: "agreementPositions",
		args: [id],
		enabled,
	});

	const { data: agreementStatus } = useContractRead({
		addressOrName: frameworkAddress,
		contractInterface: frameworkAbi,
		functionName: "agreementStatus",
		args: [id],
		enabled,
	});

	const status: string = useMemo(() => {
		if (typeof agreementStatus === "number") {
			switch (agreementStatus) {
				case 0:
					return "Created";
				case 1:
					return "Ongoing";
				case 2:
					return "Finalized";
				case 3:
					return "Disputed";
				default:
					return "Unknown";
			}
		}
		return "Unknown";
	}, [agreementStatus]);

	return { params, positions, status: status };
};

/* Temporal workarround to process agreement creation event */
const eventAbi = [
	"event AgreementCreated(bytes32 id, bytes32 termsHash, uint256 criteria, string metadataURI)",
];
interface CreatedEventArgs {
	id: string;
	termsHash: string;
	criteria: BigNumber;
	metadataURI: string;
}
const iface = new utils.Interface(eventAbi);

export const useAgreementCreate = ({ onSettledSuccess }: { onSettledSuccess?: () => void }) => {
	const { write, data, ...args } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: frameworkAddress,
		contractInterface: frameworkAbi,
		functionName: "createAgreement",
		onSettled(data, error) {
			if (onSettledSuccess && data) {
				onSettledSuccess();
			} else {
				console.log(error);
			}
		},
	});

	const {
		data: receipt,
		isLoading: isProcessing,
		isSuccess: txSuccess,
	} = useWaitForTransaction({
		hash: data?.hash,
	});

	/* Temporal patch to fetch the creation event */
	const created = useMemo((): CreatedEventArgs | undefined => {
		if (txSuccess && receipt) {
			const args = iface.parseLog(receipt.logs[0]).args;
			if (args.length == 4) {
				return { id: args[0], termsHash: args[1], criteria: args[2], metadataURI: args[3] };
			}
		}
		return undefined;
	}, [txSuccess, receipt]);

	const create = ({
		termsHash,
		criteria,
		metadataURI,
	}: {
		termsHash: string;
		criteria: string;
		metadataURI: string;
	}) => {
		write?.({
			recklesslySetUnpreparedArgs: [{ termsHash, criteria, metadataURI }],
		});
	};

	return { create, created, isProcessing, data, ...args };
};

export const useAgreementJoin = () => {
	const {
		write: joinAgreement,
		data,
		...args
	} = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: frameworkAddress,
		contractInterface: frameworkAbi,
		functionName: "joinAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const { isLoading: isProcessing } = useWaitForTransaction({
		hash: data?.hash,
	});

	const join = async ({ id, resolver }: { id: string; resolver: Resolver }) => {
		if (!resolver.proof) {
			return;
		} else {
			return joinAgreement?.({
				recklesslySetUnpreparedArgs: [id, resolver],
			});
		}
	};

	return { join, data, isProcessing, ...args };
};

export const useAgreementDispute = ({ id }: { id: string }) => {
	const {
		write: disputeAgreement,
		data,
		...args
	} = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: frameworkAddress,
		contractInterface: frameworkAbi,
		functionName: "disputeAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const { isLoading: isProcessing } = useWaitForTransaction({
		hash: data?.hash,
	});

	const dispute = () => {
		disputeAgreement?.({
			recklesslySetUnpreparedArgs: [id],
		});
	};

	return { dispute, data, isProcessing, ...args };
};

export const useAgreementFinalize = ({ id }: { id: string }) => {
	const {
		write: finalizeAgreement,
		data,
		...args
	} = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: frameworkAddress,
		contractInterface: frameworkAbi,
		functionName: "finalizeAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const { isLoading: isProcessing } = useWaitForTransaction({
		hash: data?.hash,
	});

	const finalize = () => {
		finalizeAgreement?.({
			recklesslySetUnpreparedArgs: [id],
		});
	};

	return { finalize, data, isProcessing, ...args };
};

export const useAgreementWithdraw = ({ id }: { id: string }) => {
	const {
		write: withdrawFromAgreement,
		data,
		...args
	} = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: frameworkAddress,
		contractInterface: frameworkAbi,
		functionName: "withdrawFromAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const { isLoading: isProcessing } = useWaitForTransaction({
		hash: data?.hash,
	});

	const withdraw = () => {
		withdrawFromAgreement?.({
			recklesslySetUnpreparedArgs: [id],
		});
	};

	return { withdraw, data, isProcessing, ...args };
};
