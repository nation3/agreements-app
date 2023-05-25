/** Some wallets (e.g. Metamask + Ledger) return a signature with a v value of 0 or 1, which is not valid.
 * This function fixes the signature by changing the v value to 27 or 28. */
export const fixSignature = (signature: string): string => {
	let v = parseInt(signature.slice(-2), 16);

	if (v < 27) {
		v = v + 27;
	}

	return signature.slice(0, -2) + v.toString(16);
};
