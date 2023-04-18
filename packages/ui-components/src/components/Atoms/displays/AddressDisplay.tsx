import React, { useEffect, useMemo, useState } from "react";
import { utils, providers } from "ethers";
import { shortenHash } from "../../../utils";
import cx from "classnames";
import { Body3 } from "../typography";

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

	return <Body3 className={cx("flex items-stretch", className)}>{displayAddress}</Body3>;
};
