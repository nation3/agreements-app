import { Signer, BigNumber } from "ethers";
import { useMemo, useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import contractInterface from "../abis/IAgreementFramework.json";
import tokenInterface from "../abis/ERC20.json";

const contractAbi = contractInterface.abi;
const tokenAbi = tokenInterface.abi;
const contractAddress = "0x51b024Ca13F6E044df4932431bF8DD0E5d4b81ba";
const tokenAddress = "0x333A4823466879eeF910A04D473505da62142069";

export const useAgreementToken = ({ signer }: { signer: Signer }) => {
	const [address, setAddress] = useState<string>();

	useEffect(() => {
		signer?.getAddress().then((address_) => {
			if (address_ != address) setAddress(address_);
		});
	}, [signer]);

	const { data: balance } = useContractRead({
		addressOrName: tokenAddress,
		contractInterface: tokenAbi,
		functionName: "balanceOf",
		args: [address],
		enabled: address != undefined,
	});

	const { data: allowance } = useContractRead({
		addressOrName: tokenAddress,
		contractInterface: tokenAbi,
		functionName: "allowance",
		args: [address, contractAddress],
		enabled: address != undefined,
	});

	const { write: approveToken } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: tokenAddress,
		contractInterface: tokenAbi,
		functionName: "approve",
		overrides: {
			gasLimit: 52000,
		},
		onError(error) {
			console.log(error);
		},
	});

	const approve = ({ amount }: { amount: BigNumber }) => {
		approveToken?.({ recklesslySetUnpreparedArgs: [contractAddress, amount] });
	};

	return { balance, allowance, approve };
};

export const useAgreementRead = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
	const { data: params } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: contractAbi,
		functionName: "agreementParams",
		args: [id],
		enabled,
	});

	const { data: positions } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: contractAbi,
		functionName: "agreementPositions",
		args: [id],
		enabled,
	});

	const { data: status } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: contractAbi,
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
		contractInterface: contractAbi,
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
		contractInterface: contractAbi,
		functionName: "joinAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const { write: finalizeAgreement } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: contractAddress,
		contractInterface: contractAbi,
		functionName: "finalizeAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const join = async () => {
		const address: string | undefined = await signer?.getAddress();
		if (!address) {
			return;
		}

		const resolver = { account: address, ...resolvers?.[address] };
		console.log("Resolver", resolver);

		if (!resolver.proof) {
			return;
		} else {
			return joinAgreement?.({
				recklesslySetUnpreparedArgs: [id, resolver],
			});
		}
	};

	const { write: disputeAgreement } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: contractAddress,
		contractInterface: contractAbi,
		functionName: "disputeAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const { write: withdrawFromAgreement } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: contractAddress,
		contractInterface: contractAbi,
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
