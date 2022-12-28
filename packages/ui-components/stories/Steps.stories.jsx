import React from 'react';

import Steps from '../src/components/steps/Steps';

export default {
    title: 'Example/steps',
    component: Steps,
}

const defaultProps = {
	steps: [
		{
			action: null,
			title: "Approve stake",
			description:
				"Lorem ipsum dolor sit amet consectetur. Aliquam rutrum est metus dolor nam eu sed ultricies.",
			image: "https://picsum.photos/200",
            stepCTA: "Start Join"
		},
		{
			action: null,
			title: "Approve stake 2",
			description:<div>
                <p className='text-xs mb-1 font-light'>Lorem ipsum dolor sit amet consectetur.</p>
                <p>0.02 $NATION Involved</p>
            </div>,
			image: "https://picsum.photos/200",
            stepCTA: "Approve stake 2"
		},
		{
			action: null,
			title: "Join Agreement",
			description:
				"Lorem ipsum dolor sit amet consectetur. Aliquam rutrum est metus dolor nam eu sed ultricies. ",
			image: "https://picsum.photos/200",
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

const StepsStory = (args) => <Steps {...args}/>;

export const StepsExample = StepsStory.bind({});

StepsExample.args = defaultProps;
