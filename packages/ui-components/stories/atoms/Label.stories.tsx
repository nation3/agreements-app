import type { Meta, StoryObj } from "@storybook/react";

import Label from "ui-components/components/atoms/Label";

const meta: Meta<typeof Label> = {
	title: "atoms/Label",
	component: Label,
	args: {
		children: "Label",
		size: "medium",
		color: "neutral-800",
		background: "neutral-100",
		border: "primary-blue-400",
	},
	argTypes: {
		children: {
			name: "Text",
			control: "text",
		},
		size: {
			name: "Size",
			control: "select",
			options: ["medium", "small"],
		},
		color: {
			name: "Color",
			control: "text",
		},
		background: {
			name: "Background",
			control: "text",
		},
		border: {
			name: "Border",
			control: "text",
		},
	},
};

export default meta;

type LabelStory = StoryObj<typeof Label>;

export const Template: LabelStory = {
	args: {},
};
