import { useMemo } from "react";
import { useNetwork } from "wagmi";
import getConstants, { Constants } from "../lib/constants";

export const useConstants = (): Constants => {
	const { chain } = useNetwork();

	const constants = useMemo(() => {
		return getConstants(chain?.id ?? 1);
	}, [chain]);

	return constants;
};
