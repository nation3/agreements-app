import { Signer } from "ethers";
import { useMemo } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import contractInterface from "../abis/IAgreementFramework.json";

const abi = contractInterface.abi;
const contractAddress = "0x51b024Ca13F6E044df4932431bF8DD0E5d4b81ba";

export const useAgreementRead = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
	const { data: params } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "agreementParams",
		args: [id],
		enabled,
	});

	const { data: positions } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "agreementPositions",
		args: [id],
		enabled,
	});

	const { data: status } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "agreementStatus",
		args: [id],
		enabled,
	});

	const parsedStatus: string = useMemo(() => {
		if (typeof status === "number") {
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
		}
		return "Unknown";
	}, [status]);

	return { params, positions, status: parsedStatus };
	// return { params, positions: undefined, status: undefined };
};

export const useAgreementCreate = ({ onSettledSuccess }: { onSettledSuccess: () => void }) => {
	return useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "createAgreement",
		onSettled(data, error) {
			if (data) {
				onSettledSuccess();
			} else {
				console.log(error);
			}
		},
	});
};

export const useAgreementActions = ({
	id,
	signer,
	resolvers,
}: {
	id: string;
	signer: Signer | undefined;
	resolvers: { [key: string]: { balance: string; proof: string[] } } | undefined;
}) => {
	const { write: joinAgreement } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "joinAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const { write: finalizeAgreement } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "finalizeAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const join = async () => {
		const address: string | undefined = await signer?.getAddress();
		if (!address) {
			return false;
		}

		const resolver = { account: address, ...resolvers?.[address] };
		console.log("Resolver", resolver);

		if (!resolver.proof) {
			return false;
		}

		joinAgreement?.({
			recklesslySetUnpreparedArgs: [id, resolver],
		});
	};

	const { write: disputeAgreement } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "finalizeAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const { write: withdrawFromAgreement } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "withdrawFromAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const finalize = () => {
		finalizeAgreement?.({
			recklesslySetUnpreparedArgs: [id],
		});
	};

	const dispute = () => {
		disputeAgreement?.({
			recklesslySetUnpreparedArgs: [id],
		});
	};

	const withdraw = () => {
		withdrawFromAgreement?.({
			recklesslySetUnpreparedArgs: [id],
		});
	};

	return { join, finalize, dispute, withdraw };
};
