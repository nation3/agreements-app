import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import * as Icons from "ui-components/icons";
import { ThemedIconRenderer, ThemedIconRendererProps } from "ui-components/components/atoms/icon-renderer";
import { Body1, Body3 } from "ui-components/components/atoms/typography";

const IconsMonoLabelled = () => {
	return (
		<>
			{Object.keys(Icons).map((iconName, index) => {
				const Icon = Icons[iconName];
				return (
					<div key={index} className="flex flex-col items-center">
						<ThemedIconRenderer icon={Icon} size="small" theme="neutral" background={false} />
						<Body3 className="text-neutral-600">{iconName}</Body3>
					</div>
				);
			})}
		</>
	);
};

const IconsGrid = ({ theme = "neutral", size = "small" }: ThemedIconRendererProps) => {
	return (
		<>
			{Object.keys(Icons).map((iconName, index) => {
				const Icon = Icons[iconName];
				return (
					<div key={index} className="flex flex-col items-center">
						<ThemedIconRenderer icon={Icon} size={size} theme={theme} />
					</div>
				);
			})}
		</>
	);
};

const IconsShowcase = ({ theme = "neutral" }: Pick<ThemedIconRenderer, "theme">) => {
	return (
		<div className="flex flex-col gap-10 items-start">
			<div>
				<Body1 className="text-neutral-800 my-4">Icons with labels</Body1>
				<div className="grid grid-cols-6 gap-4">
					<IconsMonoLabelled />
				</div>
			</div>
			<div>
				<Body1 className="text-neutral-800 my-4">Large icons</Body1>
				<div className="grid grid-cols-6 gap-4">
					<IconsGrid theme={theme} size="large" />
				</div>
			</div>
			<div>
				<Body1 className="text-neutral-800 my-4">Small icons</Body1>
				<div className="grid grid-cols-6 gap-4">
					<IconsGrid theme={theme} />
				</div>
			</div>
		</div>
	);
};

const meta: Meta<typeof IconsShowcase> = {
	title: "theme/Icons",
	component: IconsShowcase,
	args: {
		theme: "neutral",
	},
	argTypes: {
		theme: {
			name: "Theme",
			control: "select",
			options: ["citizen", "agreement", "dispute", "neutral"],
		},
	},
};

export default meta;

type IconsStory = StoryObj<typeof IconsShowcase>;

export const Showcase: IconsStory = {
	args: {},
};
