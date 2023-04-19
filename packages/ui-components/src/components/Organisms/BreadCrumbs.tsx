import React, { FC, useState } from "react";
import { Body3 } from "../Atoms";

interface Step {
	title: string;
	hidden?: boolean;
}

interface BreadcrumbsProps {
	steps: Step[];
	onStepChange: (index: number) => void;
}

const Breadcrumbs: FC<BreadcrumbsProps> = (props) => {
	const { steps, onStepChange } = props;
	const [activeStep, setActiveStep] = useState<number>(0);

	const handleStepChange = (index: number) => {
		setActiveStep(index);
		onStepChange(index);
	};

	return (
		<nav className="flex items-center gap-4">
			{steps.map((step, index) => {
				if (step.hidden) {
					return null;
				}

				return (
					<React.Fragment key={index}>
						<button
							className={`py-min2 px-min3 ${
								activeStep === index ? "text-neutral-c-800 " : "text-neutral-c-500"
							}`}
							onClick={() => handleStepChange(index)}
						>
							<Body3>{step.title}</Body3>
						</button>
						{index < steps.length - 1 && !steps[index + 1].hidden && (
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
						)}
					</React.Fragment>
				);
			})}
		</nav>
	);
};

export { Breadcrumbs };
