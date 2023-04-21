import React, { FC, useState } from "react";
import { Body3 } from "../Atoms";
import cx from "classnames";

interface Step {
	title: string;
	hidden?: boolean;
}

interface BreadcrumbsProps {
	steps: Step[];
	onStepChange: (index: number) => void;
	hidden?: boolean;
}

const Breadcrumbs: FC<BreadcrumbsProps> = (props) => {
	const { steps, onStepChange, hidden = false } = props;
	const [activeStep, setActiveStep] = useState<number>(0);

	const handleStepChange = (index: number) => {
		setActiveStep(index);
		onStepChange(index);
	};

	if (hidden) {
		return null;
	}

	return (
		<nav className="flex items-center gap-4">
			{steps.map((step, index) => {
				if (step.hidden) {
					return null;
				}

				return (
					<div className={`flex w-full`} key={index}>
						<div
							className={`mr-min3 last:mr-0 w-full cursor-pointer ${
								activeStep >= index ? "text-neutral-c-800 " : "text-neutral-c-500"
							}`}
							onClick={() => handleStepChange(index)}
						>
							<div
								className={cx(
									"h-[4px] w-full rounded mb-min1",
									activeStep >= index ? "bg-pr-c-green3" : "bg-pr-c-green1",
								)}
							></div>

							<Body3>{step.title}</Body3>
						</div>
						{/* {index < steps.length - 1 && !steps[index + 1].hidden && (
							<svg
								className="w-4 h-4 text-neutral-c-500"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M9 5L16 12L9 19"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						)} */}
					</div>
				);
			})}
		</nav>
	);
};

export { Breadcrumbs };
