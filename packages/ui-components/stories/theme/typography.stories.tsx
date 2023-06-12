import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
	Headline1,
	Headline2,
	Headline3,
	Headline4,
	BodyHeadline,
	HeadlineBasic,
	Body1,
	Body2,
	Body3,
} from "ui-components/components/atoms/typography";

const TypographyShowcase = ({ text }: { text: string }) => {
	return (
		<div className="">
			<Body3 className="text-neutral-600">Headline 1</Body3>
			<Headline1>{text}</Headline1>
			<Body3 className="text-neutral-600">Headline 2</Body3>
			<Headline2>{text}</Headline2>
			<Body3 className="text-neutral-600">Headline 3</Body3>
			<Headline3>{text}</Headline3>
			<Body3 className="text-neutral-600">Headline 4</Body3>
			<Headline4>{text}</Headline4>
			<Body3 className="text-neutral-600">Headline Basic</Body3>
			<HeadlineBasic>{text}</HeadlineBasic>
			<Body3 className="text-neutral-600">Body Headline</Body3>
			<BodyHeadline>{text}</BodyHeadline>
			<Body3 className="text-neutral-600">Body 1</Body3>
			<Body1>{text}</Body1>
			<Body3 className="text-neutral-600">Body 2</Body3>
			<Body2>{text}</Body2>
			<Body3 className="text-neutral-600">Body 3</Body3>
			<Body3>{text}</Body3>
		</div>
	);
};

const meta: Meta<typeof TypographyShowcase> = {
	title: "theme/Typography",
	component: TypographyShowcase,
	args: {
		text: "Nation3, flourishing human potential",
	},
	argTypes: {
		text: {
			name: "Text",
			control: { type: "text" },
		},
	},
};

export default meta;

type TypographyStory = StoryObj<typeof TypographyShowcase>;

export const Showcase: TypographyStory = {
	args: {},
};
