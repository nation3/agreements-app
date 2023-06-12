import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import ActionIconLabel from "ui-components/components/molecules/labels/ActionIconLabel";
import { ThemedIconRenderer } from "ui-components/components/atoms/icon-renderer";
import { N3Icon } from "ui-components/icons";

const meta: Meta<typeof ActionIconLabel> = {
	title: "molecules/ActionIconLabel",
	component: ActionIconLabel,
	args: {
		icon: <ThemedIconRenderer icon={N3Icon} theme="citizen" rounded={false} />,
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

type IconLabelStory = StoryObj<typeof ActionIconLabel>;

export const Template: IconLabelStory = {
	args: {},
};
