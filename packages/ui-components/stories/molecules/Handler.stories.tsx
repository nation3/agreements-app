import type { Meta, StoryObj } from "@storybook/react";

import Handler from "ui-components/components/molecules/handlers/Handler";
import { N3Icon, DropdownIcon } from "ui-components/icons";

const meta: Meta<typeof Handler> = {
	title: "molecules/Handler",
	component: Handler,
	args: {
		primaryIcon: N3Icon,
		actionIcon: DropdownIcon,
		children: "This is a Handler",
		theme: "citizen",
	},
	argTypes: {
		primaryIcon: {
			name: "Primary Icon",
			control: "none",
		},
		actionIcon: {
			name: "Action Icon",
			control: "none",
		},
		children: {
			name: "Label",
			control: "text",
		},
		theme: {
			name: "Theme",
			control: "select",
			options: ["citizen", "agreement", "dispute", "neutral"],
		},
	},
};

export default meta;

type HandlerStory = StoryObj<typeof Handler>;

export const Template: HandlerStory = {
	args: {},
};
