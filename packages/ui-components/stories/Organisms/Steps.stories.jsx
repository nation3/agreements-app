import React from 'react';

import Steps from '../../src/components/Organisms/steps/Steps';
import courtIcon from "../assets/court.svg";
import nationCoinIcon from "../assets/nation_coin.svg";

export default {
	component: Steps,
    title: 'Organisms/Steps',
}


const Template = (args) => <Steps {...args}/>;

export const Default = Template.bind({});
Default.args = {
	steps: [
		{
			action: null,
			title: "Approve stake",
			description:
				"Lorem ipsum dolor sit amet consectetur. Aliquam rutrum est metus dolor nam eu sed ultricies.",
			image: nationCoinIcon,
            stepCTA: "Start Join"
		},
		{
			action: null,
			title: "Approve stake 2",
			description:<div>
                <p className='text-xs mb-1 font-light'>Lorem ipsum dolor sit amet consectetur.</p>
                <p>0.02 $NATION Involved</p>
            </div>,
			image: courtIcon,
            stepCTA: "Approve stake 2"
		},
		{
			action: null,
			title: "Join Agreement",
			description:
				"Lorem ipsum dolor sit amet consectetur. Aliquam rutrum est metus dolor nam eu sed ultricies. ",
			image: nationCoinIcon,
            stepCTA: "Join Agreement"
		},
	],
	icon: "https://picsum.photos/50",
	title: "Join Agreement",
	stepModifier: null,
	stepIndex: 2,
	loadingIndex:2,
	areStepsFinished: false,
	finishImage: "https://picsum.photos/200",
	finishAction: null,
	finishMessage: <div>
	<p className='text-2xl font-bold text-slate-700 mb-1'>Join Agreement succesful</p>
	<p>You finished the steps</p>
</div>,
};

export const Finished = Template.bind({});
Finished.args = {
	...Default.args,
	areStepsFinished: true
};
