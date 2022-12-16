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
			title: "This is a title",
			description:
				"Lorem ipsum dolor sit amet consectetur. Aliquam rutrum est metus dolor nam eu sed ultricies.",
			image: "https://picsum.photos/200",
            stepCTA: "Approve stake"
		},
		{
			action: null,
			title: "This is a title 2",
			description:<div>
                <p className='text-xs mb-1 font-light'>Lorem ipsum dolor sit amet consectetur.</p>
                <p>0.02 $NATION Involved</p>
            </div>,
			image: "https://picsum.photos/200",
            stepCTA: "Approve stake 2"
		},
		{
			action: null,
			title: "This is a title 3",
			description:
				"Lorem ipsum dolor sit amet consectetur. Aliquam rutrum est metus dolor nam eu sed ultricies. ",
			image: "https://picsum.photos/200",
            stepCTA: "Approve stake 3"
		},
	],
	icon: "https://picsum.photos/50",
	title: "Join Agreement",
	stepModifier: null,
	stepIndex: 2,
};


const StepsStory = (args) => <Steps {...args}/>;

export const StepsExample = StepsStory.bind({});

StepsExample.args = defaultProps;
