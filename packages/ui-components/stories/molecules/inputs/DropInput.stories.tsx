import type { Meta, StoryObj } from "@storybook/react";

import { DropInput } from "ui-components/components/molecules/inputs/DropInput";

const meta: Meta<typeof DropInput> = {
    title: "molecules/inputs/DropInput",
    component: DropInput,
    argTypes: {
        label: { control: "text" },
        showFiles: { control: "boolean" },
        acceptedFiles: { control: "array" },
    },
};

export default meta;

type DropInputStory = StoryObj<typeof DropInput>;

export const Default: DropInputStory = {
    args: {
    showFiles: true,
    }
};