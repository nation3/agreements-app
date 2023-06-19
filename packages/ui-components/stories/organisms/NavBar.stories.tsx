import type { Meta, StoryObj } from "@storybook/react";

import NavBar from "ui-components/components/organisms/NavBar";

const meta: Meta<typeof NavBar> = {
    title: "organisms/NavBar",
    component: NavBar,
};

export default meta;

type NavBarStory = StoryObj<typeof NavBar>;

export const Default: NavBarStory = {
    args: {},
};