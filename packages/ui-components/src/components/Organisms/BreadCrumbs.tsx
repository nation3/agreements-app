import cx from "classnames";
import React, { FC } from "react";
import { Body3 } from "../Atoms";

interface Step {
	title: string;
	hidden?: boolean;
}

interface BreadcrumbsProps {
	steps: Step[];
	onStepChange: (index: number) => void;
	hidden?: boolean;
	activeStep: number; // Add activeStep as a prop
}

const Breadcrumbs: FC<BreadcrumbsProps> = (props) => {
	const { steps, onStepChange, hidden = false, activeStep } = props; // Remove the useState for activeStep

	const handleStepChange = (index: number) => {
		onStepChange(index);
	};

	if (hidden) {
		return null;
	}

	return (
		<nav className="flex gap-4">
			{steps.map((step, index) => {
				if (step.hidden) {
					return null;
				}

				return (
					<div className={`flex w-full`} key={index}>
						<div
							className={`mr-min3 last:mr-0 w-full gap-min2 flex flex-col ${
								activeStep >= index ? "text-neutral-c-800 " : "text-neutral-c-500"
							} ${index < activeStep && "cursor-pointer"}`}
							onClick={() => {
								index < activeStep && handleStepChange(index);
							}}
						>
							<div
								className={cx(
									"h-[4px] w-full rounded mb-min1",
									activeStep >= index ? "bg-pr-c-green3" : "bg-pr-c-green1",
								)}
							></div>

							<Body3 className="sm-only:text-xs">{step.title}</Body3>
						</div>
					</div>
				);
			})}
		</nav>
	);
};

export { Breadcrumbs };
