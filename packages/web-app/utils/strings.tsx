export const purgeFloat = (
	number: string,
	config?: { units?: number; strip?: boolean },
): string => {
	const maxDecimals = config?.units ?? 18;
	const purged = number
		.replace(/[^0-9,.]/g, "")
		.replace(/,/g, ".")
		.replace(new RegExp(`^(\\d*(\\.\\d{0,${maxDecimals}})?)\\d*$`, "g"), "$1");

	return config?.strip ? purged.replace(/\.$/g, "") : purged;
};
