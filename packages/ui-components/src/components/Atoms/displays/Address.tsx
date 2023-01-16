import React, { useEffect, useState } from "react";
import { utils, providers } from "ethers";
import { shortenHash } from "../../../utils";

export const AddressDisplay = ({
	address,
	ensProvider,
}: {
	address: string;
	ensProvider?: providers.BaseProvider;
}) => {
	const [value, setValue] = useState(shortenHash(address));

	useEffect(() => {
		ensProvider?.lookupAddress(utils.getAddress(address)).then((name) => {
			if (name) {
				setValue((prevValue) => (name != prevValue ? name : prevValue));
			}
			return null;
		});
	}, [address, ensProvider]);

	return <span>{value}</span>;
};
