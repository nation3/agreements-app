import React, { useEffect, useMemo, useState } from "react";
import { utils, providers } from "ethers";
import { shortenHash } from "../../../utils";

export const AddressDisplay = ({
	address,
	ensProvider,
}: {
	address: string;
	ensProvider?: providers.BaseProvider;
}) => {
	const shortAddress = useMemo(() => shortenHash(utils.getAddress(address)), [address]);
	const [value, setValue] = useState(shortAddress);

	useEffect(() => {
		ensProvider?.lookupAddress(utils.getAddress(address)).then((name) => {
			if (name) {
				setValue((prevName) => (name != prevName ? name : prevName));
			} else {
				setValue(shortAddress);
			}
			return shortAddress;
		});
	}, [address, shortAddress, ensProvider]);

	return <span>{value}</span>;
};
