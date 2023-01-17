import React from 'react';

import { CheckCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import { Button } from '../../src/components/Molecules/buttons';
// import { Button } from './Button';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Molecules/Button',
    component: Button,
    argTypes: {
        iconLeft: {
            options: ["check"],
            mapping: {
                check: <CheckCircleIcon className="w-5 h-5" />
            }
        },
        iconRight: {
            options: ["arrow"],
            mapping: {
                arrow: <ArrowRightIcon className="w-5 h-5" />
            }
        }
    }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <div className="w-80"><Button {...args} /></div>;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
    label: 'Button',
};

export const Icon = Template.bind({});
Icon.args = {
    iconLeft: 'check',
    label: 'Button',
};

export const Outlined = Template.bind({});
Outlined.args = {
    label: 'Button',
    outlined: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
    label: 'Button',
    disabled: true,
};

