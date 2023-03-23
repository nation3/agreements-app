import { BigNumber } from "ethers";
import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import tokenInterface from "../abis/ERC20.json";

const tokenAbi = tokenInterface.abi;

export interface IUseTokenReturn {
	balance: any;
	allowance: any;
	// approve: any;
	// approvalLoading: boolean;
	// approvalProcessing: boolean;
	// approvalSuccess: boolean;
	// approvalError: boolean;
}

export interface IUseToken {
	address: string;
	account: string;
	spender: string;
	enabled: boolean;
}

export const useTokenAllowance = ({
	address,
	owner,
	spender,
	enabled = true,
}: {
	address: string;
	owner: string;
	spender: string;
	enabled: boolean;
}) => {
	const { data: allowance } = useContractRead({
		addressOrName: address,
		contractInterface: tokenAbi,
		functionName: "allowance",
		args: [owner, spender],
		enabled: enabled,
		watch: true,
	});

	return { allowance };
};

export const useTokenApprovals = ({ address, spender }: { address: string; spender: string }) => {
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
			gasLimit: 60000,
			// maxFeePerGas: 250000000,
			// maxPriorityFeePerGas: 250000000,
		},
		onError(error) {
			console.log(error);
		},
	});

	const {
		isLoading: approvalProcessing,
		isSuccess: approvalSuccess,
		isError: approvalError,
	} = useWaitForTransaction({
		hash: approvalTx?.hash,
	});

	const approve = ({ amount }: { amount: BigNumber }) => {
		approveToken?.({ recklesslySetUnpreparedArgs: [spender, amount] });
	};

	return {
		approve,
		approvalLoading,
		approvalProcessing,
		approvalSuccess,
		approvalError,
	};
};

export const useTokenBalance = ({
	address,
	account,
	enabled = true,
}: {
	address: string;
	account: string;
	enabled?: boolean;
}) => {
	const { data: balance } = useContractRead({
		addressOrName: address,
		contractInterface: tokenAbi,
		functionName: "balanceOf",
		args: [account],
		enabled: enabled,
		watch: true,
	});

	return { balance };
};

export const useToken = ({
	address,
	account,
	spender,
	enabled = true,
}: IUseToken): IUseTokenReturn => {
	const { data: balance } = useContractRead({
		addressOrName: address,
		contractInterface: tokenAbi,
		functionName: "balanceOf",
		args: [account],
		enabled: enabled,
		watch: true,
	});

	const { allowance } = useTokenAllowance({
		address,
		owner: account,
		spender,
		enabled,
	});

	return {
		balance,
		allowance,
	};
};
