import React from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

import { ActionBadge } from "../../src/components/Molecules/badges";
import { ActionBadgeProps } from "../../src/components/Molecules/badges/ActionBadge";

export default {
	title: "Molecules/ActionBadge",
	component: ActionBadge,
};

const address = "0x0";
const copyAddressAction = () => {
	// eslint-disable-next-line no-undef
	navigator.clipboard.writeText(address);
};

const Template = (args: ActionBadgeProps) => <ActionBadge {...args} />;

export const Default = Template.bind({});
Default.args = {
	label: "Hash",
	data: "0x000...000",
	dataAction: copyAddressAction,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
	label: "Hash",
	data: "0x000...000",
	icon: <CheckBadgeIcon className="w-4 h-4" />,
	iconAction: copyAddressAction,
};

export const WithTooltip = Template.bind({});
WithTooltip.args = {
	label: "Hash",
	data: "0x000...000",
	tooltipContent: "Test tooltip",
	tooltip: true,
};
