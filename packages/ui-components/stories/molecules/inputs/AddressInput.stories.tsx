import type { Meta, StoryObj } from "@storybook/react";

import { AddressInput } from "ui-components/components/molecules/inputs/AddressInput";

const meta: Meta<typeof AddressInput> = {
    title: "molecules/inputs/AddressInput",
    component: AddressInput,
    argTypes: {
        label: { control: "text" },
        placeholder: { control: "text" },
        value: { control: "text" },
        disabled: { control: "boolean" },
        status: { control: "select", options: ["default", "success", "warning", "error"]}
    },
};

export default meta;

type AddressInputStory = StoryObj<typeof AddressInput>;

export const Default: AddressInputStory = {
    args: {
        label: "Label",
        placeholder: "0x...",
        disabled: false,
        status: "default",
    },
};