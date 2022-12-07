import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import arbitratorInterface from "../abis/Arbitrator.json";
import { arbitratorAddress } from "../lib/constants";
import { useMemo } from "react";
import { BigNumber } from "ethers";

const arbitratorAbi = arbitratorInterface.abi;

type ResolutionData = { status: string; mark: string; metadataURI: string; unlockBlock: number };

type ResolutionInput = {
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
				return "Submitted";
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
