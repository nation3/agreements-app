import React from 'react';
import Headline1 from "../../src/components/Atoms/typography/Headline1";
import Headline2 from "../../src/components/Atoms/typography/Headline2";
import Headline3 from "../../src/components/Atoms/typography/Headline3";
import Headline4 from "../../src/components/Atoms/typography/Headline4";
import Body1 from "../../src/components/Atoms/typography/Body1";
import Body2 from "../../src/components/Atoms/typography/Body2";
import Body3 from "../../src/components/Atoms/typography/Body3";

export default {
    title: 'Atoms/Fonts',
    component: Headline1,
};

const paragraph ="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultrices justo vel eros scelerisque ultrices. Suspendisse quis metus non ante pharetra bibendum."

const Template = (args) => <section className='p-n8'>
    <p className='mb-n4 text-neutral-c-600'>Headlines</p>
    <hr className='mb-n4'></hr>
    <Headline1 {...args} >Headline 1</Headline1>
    <Headline2 {...args} >Headline 2</Headline2>
    <Headline3 {...args} >Headline 3</Headline3>
    <Headline4 {...args} >Headline 4</Headline4>
    <p className='mt-n16 mb-n4 text-neutral-c-600'>Paragraphs</p>
    <hr className='mb-n4'></hr>
    <Body1 {...args} className='mb-n8'>{paragraph}</Body1>
    <Body2 {...args} className='mb-n8'>{paragraph}</Body2>
    <Body3 {...args} className='mb-n4'>{paragraph}</Body3>
    </section>;

export const LabelDataIcon = Template.bind({});
LabelDataIcon.args = {
}


