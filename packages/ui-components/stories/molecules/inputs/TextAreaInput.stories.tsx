import type { Meta, StoryObj } from "@storybook/react";

import { TextAreaInput } from "ui-components/components/molecules/inputs/TextAreaInput";

const meta: Meta<typeof TextAreaInput> = {
    title: "molecules/inputs/TextAreaInput",
    component: TextAreaInput,
    argTypes: {
        label: { control: "text" },
        placeholder: { control: "text" },
        value: { control: "text" },
        disabled: { control: "boolean" },
        status: { control: "select", options: ["default", "success", "warning", "error"]}
    },
};

export default meta;

type TextAreaInputStory = StoryObj<typeof TextAreaInput>;

export const Default: TextAreaInputStory = {
    args: {
        label: "Label",
        placeholder: "Placeholder",
        disabled: false,
        status: "default",
    },
};