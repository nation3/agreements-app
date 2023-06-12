import type { Meta, StoryObj } from "@storybook/react";

import { IconRenderer } from "ui-components/components/atoms/icon-renderer";
import { N3Icon } from "ui-components/icons";

const meta: Meta<typeof IconRenderer> = {
	title: "atoms/icon-renderer/IconRenderer",
	component: IconRenderer,
	argTypes: {
		/*
        icon: {
            name: "Icon",
            control: { type: "object" },
        },
        */
		size: {
			name: "Size",
			control: "select",
			options: ["small", "large", "30"],
		},
	},
};

export default meta;

type IconRendererStory = StoryObj<typeof IconRenderer>;

export const Template: IconRendererStory = {
	args: {
		icon: N3Icon,
		size: "large",
		color: "primary-blue-600",
		background: "neutral-200",
	},
	argTypes: {
		color: {
			name: "Color",
			control: "select",
			options: ["primary-blue-600", "primary-green-600", "secondary-orange-600", "neutral-600"],
		},
		background: {
			name: "Background",
			control: "select",
			options: [
				"primary-blue-200",
				"primary-green-200",
				"secondary-orange-200",
				"neutral-200",
				"transparent",
			],
		},
	},
};
