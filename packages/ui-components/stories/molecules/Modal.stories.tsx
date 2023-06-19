import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from 'ui-components/components/atoms';
import { Modal } from 'ui-components/components/molecules/modals/Modal';

const meta: Meta<typeof Modal> = {
    title: 'molecules/Modal',
    component: Modal,
    argTypes: {
        children: { control: 'text' },
        isOpen: { control: 'none' },
        onClose: { control: 'none' },
        className: { control: 'string' },
    },
};

export default meta;

type ModalStory = StoryObj<typeof Modal>;

export const Default = (args: ModalStory) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="flex flex-col w-full items-center justify-center">
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal
                {...args}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
            </Modal>
        </div>
    );
}

Default.args = {
    children: 'This is a Modal',
    className: 'p-6 border-x border-t md:border-y border-neutral-500',
}