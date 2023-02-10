import React, { useEffect, useMemo, useState } from "react";
import { utils, providers } from "ethers";
import { shortenHash } from "../../../utils";

export const AddressDisplay = ({
	address,
	ensName,
}: {
	address: string;
	ensName?: string;
}) => {
	const displayAddress = useMemo(() => ensName ?? shortenHash(utils.getAddress(address)), [address, ensName]);

	return <span>{displayAddress}</span>;
};
