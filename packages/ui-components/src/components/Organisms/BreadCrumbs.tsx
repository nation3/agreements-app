import cx from "classnames";
import React, { FC } from "react";
import { Body3 } from "../../components/atoms";

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
							className={`mr-3 last:mr-0 w-full gap-2 flex flex-col ${
								activeStep >= index ? "text-neutral-800 " : "text-neutral-500"
							} ${index < activeStep && "cursor-pointer"}`}
							onClick={() => {
								index < activeStep && handleStepChange(index);
							}}
						>
							<div
								className={cx(
									"h-1 w-full rounded mb-1",
									activeStep >= index ? "bg-primary-green-200" : "bg-primary-green-600",
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

export default Breadcrumbs;
