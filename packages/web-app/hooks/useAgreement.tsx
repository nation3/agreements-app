// import { BigNumber, utils } from "ethers";
import { PermitBatchTransferFrom } from "@uniswap/permit2-sdk";
import { BigNumber } from "ethers";
import { useCallback, useMemo } from "react";
import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import frameworkInterface from "../abis/CollateralAgreementFramework.json";
import { Resolver } from "../utils/criteria";
import { useConstants } from "./useConstants";

const frameworkAbi = frameworkInterface.abi;

const agreementStatus = (status: number) => {
	switch (status) {
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
};

export const useAgreementData = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
	const { frameworkAddress } = useConstants();
	const { data: agreementData } = useContractRead({
		addressOrName: frameworkAddress,
		contractInterface: frameworkAbi,
		functionName: "agreementData",
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

	const data = useMemo(() => {
		return {
			termsHash: agreementData?.termsHash,
			criteria: agreementData?.criteria,
			metadataURI: agreementData?.metadataURI,
			token: agreementData?.token,
			status:
				typeof agreementData?.status === "number"
					? agreementStatus(agreementData.status)
					: "Unknown",
		};
	}, [agreementData]);

	return { data, positions };
};

export const useAgreementCreate = ({
	onSettledSuccess,
	onSuccess,
}: {
	onSettledSuccess?: () => void;
	onSuccess?: (data?: unknown) => void;
	onTxSuccess?: (data?: unknown) => void;
}) => {
	const { frameworkAddress } = useConstants();
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
		onSuccess,
		overrides: {
			gasLimit: 190000,
			// maxFeePerGas: 250000000,
			// maxPriorityFeePerGas: 250000000,
		},
	});

	const { isLoading: isProcessing, isSuccess: isTxSuccess } = useWaitForTransaction({
		hash: data?.hash,
	});

	const create = ({
		termsHash,
		criteria,
		metadataURI,
		token,
		salt,
	}: {
		termsHash: string;
		criteria: string;
		metadataURI: string;
		token: string;
		salt: string;
	}) => {
		write?.({
			recklesslySetUnpreparedArgs: [{ termsHash, criteria, metadataURI, token }, salt],
		});
	};

	return { create, isProcessing, data, isTxSuccess, ...args };
};

type JoinWithPermitArgs = {
	id: string;
	resolver: Resolver;
	permit: PermitBatchTransferFrom;
	signature: string;
};

type JoinWithApprovalArgs = {
	id: string;
	resolver: Resolver;
};

type JoinMode = "permit" | "approval";
type JoinParametersBasedOnPermit<T extends JoinMode> = T extends "permit"
	? JoinWithPermitArgs
	: JoinWithApprovalArgs;

export const useAgreementJoin = <T extends JoinMode>({ mode }: { mode?: T }) => {
	const { join: joinWithPermit, ...argsWithPermit } = useAgreementJoinPermit();
	const { join: joinWithApproval, ...argsWithApproval } = useAgreementJoinApproved();

	const join = useCallback(
		(args: JoinParametersBasedOnPermit<T>) => {
			if (mode === "permit") {
				return joinWithPermit(args as JoinWithPermitArgs);
			} else {
				return joinWithApproval(args as JoinWithApprovalArgs);
			}
		},
		[joinWithApproval, joinWithPermit, mode],
	);

	const args = useMemo(() => {
		if (mode === "permit") {
			return argsWithPermit;
		} else {
			return argsWithApproval;
		}
	}, [argsWithApproval, argsWithPermit, mode]);

	return { join, ...args };
};

export const useAgreementJoinApproved = () => {
	const { frameworkAddress } = useConstants();

	const {
		write: joinAgreement,
		data,
		...args
	} = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: frameworkAddress,
		contractInterface: frameworkAbi,
		functionName: "joinAgreementApproved",
		onError(error) {
			console.log(error);
		},
		overrides: {
			gasLimit: 320000,
		},
	});

	const { isLoading: isProcessing, isSuccess: isTxSuccess } = useWaitForTransaction({
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

	return { join, data, isProcessing, isTxSuccess, ...args };
};

export const useAgreementJoinPermit = () => {
	const { frameworkAddress } = useConstants();

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
		overrides: {
			gasLimit: 320000,
		},
	});

	const { isLoading: isProcessing, isSuccess: isTxSuccess } = useWaitForTransaction({
		hash: data?.hash,
	});

	const join = async ({
		id,
		resolver,
		permit,
		signature,
	}: {
		id: string;
		resolver: Resolver;
		permit: PermitBatchTransferFrom;
		signature: string | undefined;
	}) => {
		if (!resolver.proof || !signature) {
			return;
		} else {
			return joinAgreement?.({
				recklesslySetUnpreparedArgs: [id, resolver, permit, signature],
			});
		}
	};

	return { join, data, isProcessing, isTxSuccess, ...args };
};

export const useAgreementDispute = ({ id }: { id: string }) => {
	const { frameworkAddress } = useConstants();
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
		overrides: {
			gasLimit: 120000,
			// maxFeePerGas: 250000000,
			// maxPriorityFeePerGas: 250000000,
		},
	});

	const { isLoading: isProcessing, isSuccess: isTxSuccess } = useWaitForTransaction({
		hash: data?.hash,
	});

	const dispute = () => {
		disputeAgreement?.({
			recklesslySetUnpreparedArgs: [id],
		});
	};

	return { dispute, data, isProcessing, isTxSuccess, ...args };
};

export const useAgreementFinalize = ({ id }: { id: string }) => {
	const { frameworkAddress } = useConstants();
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
		overrides: {
			gasLimit: 120000,
			// maxFeePerGas: 250000000,
			// maxPriorityFeePerGas: 250000000,
		},
	});

	const { isLoading: isProcessing, isSuccess: isTxSuccess } = useWaitForTransaction({
		hash: data?.hash,
	});

	const finalize = () => {
		finalizeAgreement?.({
			recklesslySetUnpreparedArgs: [id],
		});
	};

	return { finalize, data, isProcessing, isTxSuccess, ...args };
};

export const useAgreementWithdraw = ({ id }: { id: string }) => {
	const { frameworkAddress } = useConstants();
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
		overrides: {
			gasLimit: 120000,
			// maxFeePerGas: 250000000,
			// maxPriorityFeePerGas: 250000000,
		},
	});

	const { isLoading: isProcessing, isSuccess: isTxSuccess } = useWaitForTransaction({
		hash: data?.hash,
	});

	const withdraw = () => {
		withdrawFromAgreement?.({
			recklesslySetUnpreparedArgs: [id],
		});
	};

	return { withdraw, data, isProcessing, isTxSuccess, ...args };
};

export const useDisputeConfig = (): {
	token: string | undefined;
	amount: BigNumber | undefined;
	recipient: string | undefined;
} => {
	const { frameworkAddress } = useConstants();
	const { data: appealConfig } = useContractRead({
		addressOrName: frameworkAddress,
		contractInterface: frameworkAbi,
		functionName: "deposits",
		onError(error) {
			console.log(error);
		},
	});
	return {
		token: appealConfig?.token,
		amount: appealConfig?.amount,
		recipient: appealConfig?.recipient,
	};
};
