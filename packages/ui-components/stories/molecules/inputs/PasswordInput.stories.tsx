import type { Meta, StoryObj } from "@storybook/react";

import { PasswordInput } from "ui-components/components/molecules/inputs/PasswordInput";

const meta: Meta<typeof PasswordInput> = {
    title: "molecules/inputs/PasswordInput",
    component: PasswordInput,
    argTypes: {
        label: { control: "text" },
        placeholder: { control: "text" },
        value: { control: "text" },
        disabled: { control: "boolean" },
        status: { control: "select", options: ["default", "success", "warning", "error"]}
    },
};

export default meta;

type PasswordInputStory = StoryObj<typeof PasswordInput>;

export const Default: PasswordInputStory = {
    args: {
        label: "Label",
        placeholder: "Placeholder",
        disabled: false,
        status: "default",
    },
};