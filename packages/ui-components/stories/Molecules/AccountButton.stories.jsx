import React from 'react';
import { CheckCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import { AccountButton } from '../../src/components/buttons';

export default {
    title: 'Molecules/Account Button',
    component: AccountButton,
};
const Template = (args) => <div className="w-80"><AccountButton {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
    account: { address: "0xasdf98as382ndqwe23", ensName: "ondragover.eth" }
};
