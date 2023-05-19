import { utils } from "ethers";
import { useMemo } from "react";
import { shortenHash } from "../../utils";

export const AddressDisplay = ({
	address,
	ensName,
	className,
}: {
	address: string;
	ensName?: string;
	className: string;
}) => {
	const displayAddress = useMemo(
		() => ensName ?? shortenHash(utils.getAddress(address)),
		[address, ensName],
	);

	return { displayAddress };
};
