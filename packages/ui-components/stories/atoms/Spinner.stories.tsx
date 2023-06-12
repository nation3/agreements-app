import type { Meta, StoryObj } from "@storybook/react";

import Spinner from "ui-components/components/atoms/Spinner";

const meta: Meta<typeof Spinner> = {
	title: "atoms/Spinner",
	component: Spinner,
	args: {
		className: "w-14 h-14 fill-primary-green-600",
	},
};

export default meta;

type SpinnerStory = StoryObj<typeof Spinner>;

export const Template: SpinnerStory = {
	args: {},
};
