export const shortenHash = (hash: string, charsStart = 4, charsEnd?: number): string => {
	return `${hash.substring(0, charsStart + 2)}...${hash.substring(
		hash.length - (charsEnd || charsStart),
	)}`;
};
