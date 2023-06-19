import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import StepsProgress, { Step } from "ui-components/components/organisms/steps/StepsProgress";

const meta: Meta<typeof StepsProgress> = {
    title: "organisms/StepsProgress",
    component: StepsProgress,
};

export default meta;

type StepsProgressStory = StoryObj<typeof StepsProgress>;

export const Default = ({args}: StepsProgressStory) => {
    const initialSteps = [{ label: "Hidden Step", hidden: true}, { label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }];
    const [currentStep, setCurrentStep] = React.useState<number>(1);
    const [steps, setSteps] = React.useState<Step[]>(initialSteps);

    return (<>
        <div className="flex flex-col w-full items-center justify-center">
            <StepsProgress steps={steps} currentStep={currentStep} onStepChange={(index: number) => {setCurrentStep(index)}}/>
        </div>
        <div className="fixed bottom-0 w-full flex-col items-center justify-between gap-2">
                <div className="flex justify-center gap-2">
                <button onClick={() => setCurrentStep(currentStep => currentStep-1)}>Back</button>
                <button onClick={() => setCurrentStep(current => current+1)}>Next</button>
                </div>
                <div className="flex justify-center gap-2">
                <button onClick={() => setSteps(steps => steps.slice(0, -1))}>Remove Step</button>
                <button onClick={() => setSteps(steps => [...steps, {label: `Step ${steps.length}`}])}>Add Step</button>
                </div>
        </div>
    </>);
}