import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { WalletInput, WalletInputValue } from "ui-components/components/molecules/inputs/WalletInput";

const meta: Meta<typeof WalletInput> = {
    title: "molecules/inputs/WalletInput",
    component: WalletInput,
    argTypes: {
        value: { control: "object" },
        label: { control: "text" },
        placeholder: { control: "text" },
        disabled: { control: "boolean" },
        status: { control: "select", options: ["default", "success", "warning", "error"] }
    },
};

export default meta;

type WalletInputStory = StoryObj<typeof WalletInput>;

export const Default = (args: WalletInputStory) => {
    const [value, setValue] = useState<WalletInputValue>({
        address: '',
        ensName: '',
    });

    const resolveAddressFromEnsName = async (ensName: string) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (ensName == 'bob.eth') {
            return '0xB0B0000000000000000000000000000000000B0B';
        } else {
            throw new Error('Not Bob');
        }
    };

    const resolveEnsNameFromAddress = async (address: string) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (address == '0xB0B0000000000000000000000000000000000B0B'.toLowerCase()) {
            return 'bob.eth';
        } else {
            throw new Error('Not Bob');
        }
    };

    return (
        <WalletInput
            {...args}
            value={value}
            onValueChange={(newValue) => {setValue(newValue)}}
            resolveAddressFromEnsName={resolveAddressFromEnsName}
            resolveEnsNameFromAddress={resolveEnsNameFromAddress}
        />);
};

Default.args = {
    label: "Label",
    placeholder: "ENS or 0x",
    disabled: false,
    status: "default",
};