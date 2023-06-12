export const shortenHash = (hash: string | undefined, charsStart = 4, charsEnd?: number): string => {
	if (!hash) return "";
	return `${hash.substring(0, charsStart + 2)}...${hash.substring(
		hash.length - (charsEnd || charsStart),
	)}`;
};
