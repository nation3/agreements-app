import React from "react";
import { DefaultLayout } from "../../src/Templates/layout/DefaultLayout";
import { ConnectButton } from "../../../web-app/components/ConnectButton";
import { Button } from "../../src/components/Molecules/buttons/Button";

export default {
	title: "Templates/Layout",
	component: DefaultLayout,
};

const Template = (args) => <DefaultLayout {...args} />;

export const Default = Template.bind({});

Default.args = {
	title: "Nation 3",
	appName: "Court",
	onRoute: null,
	isActiveRoute: null,
	connectionButton: <Button className="px-4 py-2" label="Connect" />,
};
