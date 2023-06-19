import React, { FC, HTMLAttributes } from "react";
import cx from "classnames";
import { Body3 } from "../../atoms";

interface Step {
	label: string;
	hidden?: boolean;
}

interface ProgressStepsProps {
	steps: Step[];
	onStepChange: (index: number) => void;
	currentStep: number; // Add activeStep as a prop
}

interface StepHandlerProps extends HTMLAttributes<HTMLDivElement> {
	label: string;
	active: boolean;
}

const StepHandler = ({label, active, className, ...props}: StepHandlerProps) => {
	return (
	<div className={cx(
		"flex flex-col py-1 border-b-2 transition-all",
		"transition-all no-wrap",
		active ? "border-primary-green-600 text-neutral-800" : "border-primary-green-200 text-neutral-500",
		"truncate",
		className
		)}
		{...props}
	>
		<Body3 className={cx("sm-only:text-xs truncate")}>{label}</Body3>
	</div>
	);
};

const ProgressSteps: FC<ProgressStepsProps> = (props) => {
	const { steps, onStepChange, currentStep } = props; // Remove the useState for activeStep

	const handleStepChange = (index: number) => {
		if (index < currentStep) onStepChange(index);
	};
	

	return (
		<nav className="flex w-full gap-4">
			{steps.map(({label, hidden}, index) => {
				return (<StepHandler
					key={index}
					label={label}
					active={index <= currentStep}
					className={cx("w-full", hidden && "hidden", (index < currentStep) && "cursor-pointer")}
					onClick={() => handleStepChange(index)}
					/>
				)
			})}
		</nav>
	);
};

export default ProgressSteps;
