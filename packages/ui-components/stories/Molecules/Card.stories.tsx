import React from "react";
import { Card } from "../../src/components/Molecules/cards/Card";

export default {
	title: "Molecules/Card",
	component: Card,
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => (
	<div className="w-full h-full flex items-center justify-center">
		<Card {...args}>
			<div className="flex border-b justify-between items-center w-full md:p-8 p-4 pl-6 md:pl-10">
				<h3 className="text-slate-600 md:text-3xl text-xl font-semibold">Title</h3>
			</div>
			<div>
				<p>
					Lorem ipsum dolor sit amet consectetur. Lectus phasellus et diam gravida convallis. Mauris
					tincidunt risus interdum praesent neque enim vel in lorem. Et sed leo magna adipiscing
					varius.
				</p>
			</div>
		</Card>
	</div>
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};
