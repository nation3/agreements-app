import type { Meta, StoryObj } from "@storybook/react";

import Footer from "ui-components/components/organisms/Footer";

const meta: Meta<typeof Footer> = {
    title: "organisms/Footer",
    component: Footer,
};

export default meta;

type FooterStory = StoryObj<typeof Footer>;

export const Template: FooterStory = {
    args: {},
};