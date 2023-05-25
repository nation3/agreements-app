import { useNetwork, useSignTypedData, useContractRead } from "wagmi";
import {
	SignatureTransfer,
	PermitTransferFrom,
	PermitBatchTransferFrom,
} from "@uniswap/permit2-sdk";
import { useTokenAllowance, useTokenApprovals } from "./useToken";
import permit2Interface from "../abis/Permit2.json";
import { firstZeroBitPosition } from "../utils/bytes";
import { BigNumber, BigNumberish, constants } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useConstants } from "./useConstants";
import { fixSignature } from "../utils/signature";

interface Permit2AllowanceConfig {
	account: string;
	token: string;
	required?: BigNumberish;
	enabled?: boolean;
}

interface TokenTransfer {
	token: string;
	amount: BigNumberish;
}

interface Permit2TransferSignatureConfig {
	tokenTransfer: TokenTransfer;
	spender: string;
	address: string;
}

interface Permit2BatchTransferSignatureConfig {
	tokenTransfers: TokenTransfer[];
	spender: string;
	address: string;
}

export const usePermit2Allowance = ({
	account,
	token,
	required,
	enabled = true,
}: Permit2AllowanceConfig) => {
	const { permit2Address } = useConstants();
	const tokenAllowanceConfig = useMemo(
		() => ({
			address: token,
			owner: account,
			spender: permit2Address,
			enabled,
		}),
		[account, token, enabled],
	);

	const { allowance } = useTokenAllowance(tokenAllowanceConfig);

	const isEnough = useMemo(() => {
		if (!BigNumber.isBigNumber(allowance)) return false;
		if (allowance.eq(constants.MaxUint256)) return true;
		if (required && BigNumber.from(required).lte(allowance)) return true;
		return false;
	}, [allowance]);

	const { approve: approvePermit2, ...args } = useTokenApprovals(tokenAllowanceConfig);

	const approve = () => {
		approvePermit2({ amount: constants.MaxUint256 });
	};

	return { allowance, isEnough, approve, ...args };
};

export const usePermit2TransferSignature = ({
	tokenTransfer,
	spender,
	address,
}: Permit2TransferSignatureConfig) => {
	const { permit2Address } = useConstants();
	const { chain } = useNetwork();

	const nonce = useAvailableNonce(address);

	const permit: PermitTransferFrom = useMemo(
		() => ({
			permitted: tokenTransfer,
			spender,
			nonce: nonce ?? 0,
			deadline: constants.MaxInt256,
		}),
		[tokenTransfer, nonce],
	);

	const domain = useMemo(
		() => ({
			name: "Permit2",
			chainId: chain?.id || 5,
			verifyingContract: permit2Address,
		}),
		[chain],
	);

	const signTypedDataConfig = useMemo(() => {
		const { types, values } = SignatureTransfer.getPermitData(permit, permit2Address, 5);
		const config = {
			domain,
			types,
			value: values,
		};
		// console.log(config.values);
		return config;
	}, [domain, permit]);

	const {
		data: signature,
		isSuccess: signSuccess,
		isError: signError,
		signTypedData: signPermit,
	} = useSignTypedData(signTypedDataConfig);

	const fixedSignature = useMemo(() => {
		if (!signSuccess || !signature) return;
		return fixSignature(signature);
	}, [signSuccess, signature]);

	return { permit, signature: fixedSignature, signPermit, signSuccess, signError };
};

export const usePermit2BatchTransferSignature = ({
	tokenTransfers,
	spender,
	address,
}: Permit2BatchTransferSignatureConfig) => {
	const { permit2Address } = useConstants();
	const { chain } = useNetwork();

	const nonce = useAvailableNonce(address);

	const permit: PermitBatchTransferFrom | undefined = useMemo(() => {
		if (!nonce) return;
		return {
			permitted: tokenTransfers,
			spender,
			nonce,
			deadline: constants.MaxInt256,
		};
	}, [tokenTransfers, nonce]);

	const domain = useMemo(
		() => ({
			name: "Permit2",
			chainId: chain?.id || 5,
			verifyingContract: permit2Address,
		}),
		[chain],
	);

	const signTypedDataConfig = useMemo(() => {
		if (!permit) return;
		const { types, values } = SignatureTransfer.getPermitData(permit, permit2Address, 5);
		const config = {
			domain,
			types,
			value: values,
		};
		return config;
	}, [domain, permit]);

	const signReady = useMemo(() => {
		if (!signTypedDataConfig || !signTypedDataConfig.value) return false;
		return true;
	}, [signTypedDataConfig]);

	const {
		data: signature,
		isSuccess: signSuccess,
		isError: signError,
		signTypedData: signPermit,
	} = useSignTypedData(signTypedDataConfig);

	const fixedSignature = useMemo(() => {
		if (!signSuccess || !signature) return;
		return fixSignature(signature);
	}, [signSuccess, signature]);

	return { permit, signature: fixedSignature, signPermit, signSuccess, signError, signReady };
};

export const useAvailableNonce = (address: string) => {
	const { permit2Address } = useConstants();
	const [wordPos, setWordPos] = useState(0);
	const [nonce, setNonce] = useState<BigNumber>();

	const { data: word } = useContractRead({
		addressOrName: permit2Address,
		contractInterface: permit2Interface.abi,
		functionName: "nonceBitmap",
		args: [address, wordPos],
	});

	useEffect(() => {
		if (!word) return;

		if (BigNumber.isBigNumber(word)) {
			if (word.eq(constants.MaxUint256)) {
				setWordPos((wordPos) => wordPos + 1);
				return;
			}

			const bitPos = firstZeroBitPosition(word);

			setNonce(BigNumber.from(wordPos).shl(8).add(bitPos));
		}
	}, [word, wordPos]);

	return nonce;
};
