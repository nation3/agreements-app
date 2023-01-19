import { BigNumber } from "ethers";
import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import tokenInterface from "../abis/ERC20.json";

const tokenAbi = tokenInterface.abi;

export interface IUseTokenReturn {
	balance: any;
	allowance: any;
	approve: any;
	approvalLoading: boolean;
	approvalProcessing: boolean;
	approvalSuccess: boolean;
	approvalError: boolean;
}

export interface IUseToken {
	address: string;
	account: string;
	spender: string;
	enabled: boolean;
}

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

	const { data: allowance } = useContractRead({
		addressOrName: address,
		contractInterface: tokenAbi,
		functionName: "allowance",
		args: [account, spender],
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
		balance,
		allowance,
		approve,
		approvalLoading,
		approvalProcessing,
		approvalSuccess,
		approvalError,
	};
};
