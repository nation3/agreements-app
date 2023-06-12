import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import AccountLabel from "ui-components/components/molecules/labels/AccountLabel";

const meta: Meta<typeof AccountLabel> = {
	title: "molecules/AccountLabel",
	component: AccountLabel,
	argTypes: {
		address: {
			name: "Address",
			control: "text",
		},
		name: {
			name: "Name",
			control: "text",
		},
		avatar: {
			name: "Avatar url",
			control: "text",
		},
		theme: {
			name: "Theme",
			control: "select",
			options: ["citizen", "agreement", "neutral"],
		},
		iconPosition: {
			name: "Icon Position",
			control: "select",
			options: ["left", "right"],
		},
		useName: {
			name: "Use Name",
			control: "boolean",
		},
		useAvatar: {
			name: "Use Avatar",
			control: "boolean",
		},
	},
};

export default meta;

type AccountLabelStory = StoryObj<typeof AccountLabel>;

export const Template = ({
	useName,
	useAvatar,
	name,
	avatar,
	...args
}: StoryObj<typeof AccountLabel>) => {
	return (
		<AccountLabel
			name={useName ? name : undefined}
			avatar={useAvatar ? avatar : undefined}
			{...args}
		/>
	);
};

Template.args = {
	address: "0xB0B0000000000000000000000000000000000B0B",
	name: "bob.eth",
	avatar:
		"https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&dpr=1&w=24",
	theme: "citizen",
	iconPosition: "left",
	useName: true,
	useAvatar: true,
};
