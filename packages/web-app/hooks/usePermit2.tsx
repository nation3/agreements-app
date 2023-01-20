import { useContractRead } from "wagmi";
import { permit2Address } from "../lib/constants";
import permit2Interface from "../abis/Permit2.json";
import { useEffect, useState } from "react";
import { BigNumber, constants } from "ethers";
import { firstZeroBitPosition } from "../utils/bytes";

export const useAvailableNonce = (address: string) => {
	const [wordPos, setWordPos] = useState(0);
	const [nonce, setNonce] = useState<BigNumber>();

	const { data: word } = useContractRead({
		addressOrName: permit2Address,
		contractInterface: permit2Interface,
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
