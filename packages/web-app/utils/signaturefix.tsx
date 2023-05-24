export const fixVInSignature = (signature: string): string => {
	let v = parseInt(signature.slice(-2), 16);

	if (v < 27) {
		v = v + 27;
	}

	return signature.slice(0, -2) + v.toString(16);
};
