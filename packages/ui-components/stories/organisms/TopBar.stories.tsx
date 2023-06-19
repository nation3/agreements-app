import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import TopBar from "ui-components/components/organisms/TopBar";

const meta: Meta<typeof TopBar> = {
    title: "organisms/TopBar",
    component: TopBar,
};

export default meta;

type TopBarStory = StoryObj<typeof TopBar>;

export const Default = (args: TopBarStory) => (
    // <div className="flex w-full items-center">
        <TopBar {...args} />
    // </div>
);
