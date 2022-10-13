import { Signer } from "ethers";
import { useMemo, useState } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import contractInterface from "../abis/IAgreementFramework.json";

const abi = contractInterface.abi;
const contractAddress = "0xb47262C22280f361ad47Af0636086463Bd29A109";

export const useAgreementRead = ({ id }: { id: string }) => {
	const { data: params } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "agreementParams",
		args: id,
	});

	const { data: positions } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "agreementPositions",
		args: id,
	});

	/* TODO: Fetch status through a view in the contract */
	const status: string = useMemo(() => {
		if (!positions) return "Unknown";

		const finalized = positions.reduce((finalized, position) => {
			if (position.status == 2) return finalized + 1;
		}, 0);
		if (finalized == positions.length) return "Finalized";

		return "Ongoing";
	}, [positions]);

	return { params, positions, status };
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
