import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";

import Arbitrator from "../abis/Arbitrator.json";
import { arbitratorAddress } from "../lib/constants";
import { useMemo } from "react";
import { ethers, BigNumber } from "ethers";

const arbitratorAbi = Arbitrator.abi;
export const arbitratorInterface = new ethers.utils.Interface(arbitratorAbi);

type ResolutionData = { status: string; mark: string; metadataURI: string; unlockTime: number };

export type ResolutionInput = {
	framework: string;
	id: string;
	settlement: { party: string; balance: BigNumber }[];
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
				return "Enacted";
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
				unlockTime: BigNumber.from(rawResolution[3]).toNumber(),
			};
		}
	}, [rawResolution]);

	return { resolution, ...args };
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
