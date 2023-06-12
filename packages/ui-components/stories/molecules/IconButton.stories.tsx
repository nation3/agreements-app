import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import IconButton from "ui-components/components/molecules/buttons/IconButton";
import { PlusIcon, RightIcon } from "ui-components/icons";

const meta: Meta<typeof IconButton> = {
	title: "molecules/IconButton",
	component: IconButton,
	argTypes: {
		leftIcon: {
			name: "Left Icon",
			control: "boolean",
		},
		rightIcon: {
			name: "Right Icon",
			control: "boolean",
		},
		children: {
			name: "Label",
			control: "text",
		},
		size: {
			name: "Size",
			control: "select",
			options: ["medium", "small", "compact"],
		},
		border: {
			name: "Border Color",
			control: "select",
			options: [
				"primary-blue-600",
				"primary-green-600",
				"secondary-orange-600",
				"primary-blue-200",
			],
		},
		disabled: {
			name: "Disabled",
			control: "boolean",
		},
		loading: {
			name: "Loading",
			control: "boolean",
		},
	},
};

export default meta;

export const Template = ({ leftIcon, rightIcon, ...args }: StoryObj<typeof IconButton>) => {
	return (
		<IconButton
			leftIcon={leftIcon ? PlusIcon : undefined}
			rightIcon={rightIcon ? RightIcon : undefined}
			{...args}
		/>
	);
};

Template.args = {
	leftIcon: true,
	rightIcon: true,
	children: "This is a Button",
	size: "medium",
	border: "primary-blue-600",
	disabled: false,
	loading: false,
};
