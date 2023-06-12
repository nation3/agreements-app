import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import IconLabel from "ui-components/components/molecules/labels/IconLabel";
import { ThemedIconRenderer } from "ui-components/components/atoms/icon-renderer";
import { N3Icon } from "ui-components/icons";

const meta: Meta<typeof IconLabel> = {
	title: "molecules/IconLabel",
	component: IconLabel,
	args: {
		icon: <ThemedIconRenderer icon={N3Icon} theme="citizen" />,
		children: "Label",
		iconPosition: "left",
	},
	argTypes: {
		icon: {
			name: "Icon",
			control: "none",
		},
		children: {
			name: "Label",
			control: "text",
		},
		iconPosition: {
			name: "Icon Position",
			control: "select",
			options: ["left", "right"],
		},
	},
};

export default meta;

type IconLabelStory = StoryObj<typeof IconLabel>;

export const Template: IconLabelStory = {
	args: {},
};
