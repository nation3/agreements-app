import React from 'react';

import { Steps } from "../src/components/steps";

export default {
    title: 'Example/Steps',
    component: Steps,
};

const Template = (args) => <div className='mt-32'><Steps {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
    steps: [{
        name: 'Approve',
        tooltipText: 'Help text',
        active: true
    },{
        name: 'Lock',
        tooltipText: 'Help text',
        link: 'https://wiki.nation3.org'
    },{
        name: 'Join and enjoy',
        tooltipText: 'Help text'
    }]
}
