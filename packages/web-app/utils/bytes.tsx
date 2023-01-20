import { constants, BigNumber } from "ethers";

// firstZeroBitPosition gets the position (index) of the first zero bit
// of a given word. Mainly used to find the next available nonce in Permit2.
export const firstZeroBitPosition = (bitword: BigNumber): number => {
	const flipped = bitword.xor(constants.MaxUint256);

	const twosComplement = flipped.xor(constants.MaxUint256).add(1);

	return Math.log2(Number(flipped.and(twosComplement)));
};
