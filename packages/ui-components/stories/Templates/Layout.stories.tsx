import React from "react";
import { ConnectButton } from "../../../web-app/components/ConnectButton";
import { Button } from "../../src/components/Molecules/buttons/Button";
import { DefaultLayout } from "../../src/Templates/defaultLayout/DefaultLayout";

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
