import type { Meta, StoryObj } from "@storybook/react";

import ActionLabel from "ui-components/components/molecules/labels/ActionLabel";

const meta: Meta<typeof ActionLabel> = {
	title: "molecules/ActionLabel",
	component: ActionLabel,
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

type ActionLabelStory = StoryObj<typeof ActionLabel>;

export const Template: ActionLabelStory = {
	args: {},
};
