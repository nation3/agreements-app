import type { Meta, StoryObj } from "@storybook/react";

import { TextInput } from "ui-components/components/molecules/inputs/TextInput";

const meta: Meta<typeof TextInput> = {
    title: "molecules/inputs/TextInput",
    component: TextInput,
    argTypes: {
        label: { control: "text" },
        placeholder: { control: "text" },
        value: { control: "text" },
        disabled: { control: "boolean" },
        status: { control: "select", options: ["default", "success", "warning", "error"]}
    },
};

export default meta;

type TextInputStory = StoryObj<typeof TextInput>;

export const Default: TextInputStory = {
    args: {
        label: "Label",
        placeholder: "Placeholder",
        disabled: false,
        status: "default",
    },
};