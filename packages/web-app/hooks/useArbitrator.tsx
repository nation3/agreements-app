import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { PermitTransferFrom } from "@uniswap/permit2-sdk";

import Arbitrator from "../abis/Arbitrator.json";
import { useMemo } from "react";
import { ethers, BigNumber } from "ethers";
import { useConstants } from "./useConstants";

const arbitratorAbi = Arbitrator.abi;
export const arbitratorInterface = new ethers.utils.Interface(arbitratorAbi);

type ResolutionData = {
	status: string;
	settlement: string;
	metadataURI: string;
	unlockTime: number;
};

export type ResolutionInput = {
	framework: string;
	dispute: string;
	settlement: { party: string; balance: BigNumber }[];
};

export const useResolution = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
	const { arbitratorAddress, frameworkAddress } = useConstants();
	const { data: rawResolution, ...args } = useContractRead({
		addressOrName: arbitratorAddress,
		contractInterface: arbitratorAbi,
		functionName: "resolutionDetails",
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
				return "Appealed";
			case 3:
				return "Endorsed";
			case 4:
				return "Enacted";
			default:
				return "Unknown";
		}
	};

	const resolution: ResolutionData | undefined = useMemo(() => {
		if (rawResolution) {
			return {
				status: statusMessage(parseInt(rawResolution[0])),
				settlement: String(rawResolution[1]),
				metadataURI: String(rawResolution[2]),
				unlockTime: BigNumber.from(rawResolution[3]).toNumber(),
			};
		}
	}, [rawResolution]);

	return { resolution, ...args };
};

export const useAppealConfig = (): {
	token: string | undefined;
	amount: BigNumber | undefined;
	recipient: string | undefined;
} => {
	const { arbitratorAddress } = useConstants();
	const { data: appealConfig } = useContractRead({
		addressOrName: arbitratorAddress,
		contractInterface: arbitratorAbi,
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

export const useResolutionExecute = () => {
	const { arbitratorAddress } = useConstants();
	const { write, data, ...args } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: arbitratorAddress,
		contractInterface: arbitratorAbi,
		functionName: "executeResolution",
		onError(error) {
			console.log(error);
		},
		overrides: {
			gasLimit: 320000,
			// maxFeePerGas: 250000000,
			// maxPriorityFeePerGas: 250000000,
		},
	});

	const { isLoading: isProcessing, isSuccess: isTxSuccess } = useWaitForTransaction({
		hash: data?.hash,
	});

	const execute = ({ framework, dispute, settlement }: ResolutionInput) => {
		write?.({
			recklesslySetUnpreparedArgs: [framework, dispute, settlement],
		});
	};

	return { execute, data, isProcessing, isTxSuccess, ...args };
};

export const useResolutionAppeal = () => {
	const { arbitratorAddress } = useConstants();
	const { write, data, ...args } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: arbitratorAddress,
		contractInterface: arbitratorAbi,
		functionName: "appealResolution",
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

	const appeal = ({
		id,
		settlement,
		permit,
		signature,
	}: Pick<ResolutionInput, "settlement"> & {
		id: string;
		permit: PermitTransferFrom;
		signature: string | undefined;
	}) => {
		if (!signature) {
			return;
		} else {
			return write?.({
				recklesslySetUnpreparedArgs: [id, settlement, permit, signature],
			});
		}
	};

	return { appeal, data, isProcessing, isTxSuccess, ...args };
};
