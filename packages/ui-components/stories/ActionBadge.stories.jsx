import React from 'react';
import { CheckBadgeIcon } from "@heroicons/react/24/outline"

import { ActionBadge } from "../src/components/badges";


export default {
    title: 'Example/ActionBadge',
    component: ActionBadge,
};

const address = "0x0";
const copyAddressAction = () => {
    navigator.clipboard.writeText(address);
};

const Template = (args) => <ActionBadge {...args} />;

export const LabelDataIcon = Template.bind({});
LabelDataIcon.args = {
    label: 'Hash',
    data: '0x000...000',
    icon: <CheckBadgeIcon className="w-4 h-4"/>,
    dataAction: copyAddressAction,
    iconAction: copyAddressAction
}
