import { useContractRead, useContractWrite } from "wagmi";
import arbitratorInterface from "../abis/Arbitrator.json";
import { arbitratorAddress } from "../lib/constants";
import { useMemo } from "react";
import { BigNumber } from "ethers";

const arbitratorAbi = arbitratorInterface.abi;

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
				return "Default";
			case 1:
				return "Pending";
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

	const resolution:
		| { status: string; mark: string; metadataURI: string; unlockBlock: number }
		| undefined = useMemo(() => {
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

export const useResolutionSubmit = () => {
	const { write: submitResolution, ...args } = useContractWrite({
		mode: "recklesslyUnprepared",
		// addressOrName: arbitratorAddress,
		addressOrName: "0xA723Fc96d9180637B21048168D0344CC677da64c",
		contractInterface: arbitratorAbi,
		functionName: "submitResolution",
		onError(error) {
			console.log(error);
		},
	});

	return { submit: submitResolution, ...args };
};

export const useResolutionExecute = () => {
	const { write: executeResolution, ...args } = useContractWrite({
		mode: "recklesslyUnprepared",
		// addressOrName: arbitratorAddress,
		addressOrName: "0xA723Fc96d9180637B21048168D0344CC677da64c",
		contractInterface: arbitratorAbi,
		functionName: "executeResolution",
		onError(error) {
			console.log(error);
		},
	});

	return { execute: executeResolution, ...args };
};
