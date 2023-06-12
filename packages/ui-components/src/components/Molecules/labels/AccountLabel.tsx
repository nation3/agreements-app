import React, { useMemo, useEffect, useState } from "react";

import IconLabel, { IconLabelProps } from "./IconLabel";
import { ThemedIconRenderer, ThemedIconRendererProps } from "../../atoms/icon-renderer";
import { UserIcon } from "../../../icons";
import { AddressDisplay } from "../../atoms/displays/AddressDisplay";

interface AccountLabelProps extends Omit<IconLabelProps, "icon" | "children"> {
	address: string;
	name?: string;
	avatar?: string;
	theme?: ThemedIconRendererProps["theme"];
}

const AccountLabel: React.FC<AccountLabelProps> = ({
	address,
	name,
	avatar,
	theme = "neutral",
	...props
}) => {
	const [avatarError, setAvatarError] = useState(false);

	// Reset avatar error state when avatar changes
	useEffect(() => {
		setAvatarError(false);
	}, [avatar]);

	const icon = useMemo(() => {
		if (avatar && !avatarError) {
			return (
				<img
					src={avatar}
					className="w-6 h-6 rounded bg-neutral-200"
					onError={() => setAvatarError(true)}
				/>
			);
		}
		return <ThemedIconRenderer theme={theme} icon={UserIcon} />;
	}, [avatar, avatarError, theme]);

	return (
		<IconLabel icon={icon} {...props}>
			<AddressDisplay address={address} ensName={name} />
		</IconLabel>
	);
};

export default AccountLabel;
