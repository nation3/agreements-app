import React from 'react';

import BottomNav from '../../src/components/Organisms/BottomNav';

export default {
	component: BottomNav,
    title: 'Organisms/BottomNav',
}

const Template = (args) => <BottomNav {...args}/>;

export const Default = Template.bind({});
Default.args = {
	connectionButton: <div className='bg-bluesky rounded-full w-12 h-12'/>
};
