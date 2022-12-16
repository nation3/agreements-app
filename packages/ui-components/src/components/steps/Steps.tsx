import React, { useState, useEffect, ReactElement } from "react";
import ReactNode from "react";
import { Spinner } from "../svgs";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

type IStepsProps = {
	steps?: {
		action: any;
		title: string;
		description: ReactElement;
		image: any;
		stepCTA?: string;
	}[];
	icon: any;
	title: string;
	stepIndex: number;
};

const defaultProps = {};

const Step = ({ stepInfo, index, stepIndex, stepsLength }: any) => {
	return (
		<div className={"flex mb-2 min-h-[80px]"}>
			<div className="flex flex-col items-center w-10 mr-5">
				<div
					className={`transition-all  border w-10 h-10 p-2 m-2 text-sm rounded-full flex items-center justify-center ${
						index < stepIndex && "border-bluesky bg-bluesky text-white"
					}`}
				>
					{index + 1}
				</div>
				{index !== stepsLength - 1 && (
					<div
						className={`w-[2px] transition-all rounded-full h-full bg-slate-200 ${
							index < stepIndex - 1 && "border-bluesky bg-bluesky"
						}`}
					></div>
				)}
			</div>
			<div>
				<div className="flex items-center">
					<p className="text-slate-700 text-xl font-semibold mb-2 pt-3 mr-3">{stepInfo.title}</p>
					{index === stepIndex - 1 && <Spinner className="w-5 h-5 mt-1 text-bluesky" />}
				</div>
				<div className={`text-slate-400 text-sm`}>{stepInfo.description}</div>
			</div>
		</div>
	);
};

const Steps: React.FC<IStepsProps> = (props) => {
	const { steps, icon, title, stepIndex } = props;

	useEffect(() => {
		// setIconLocal(icon);
	}, []);

	return (
		<section className="max-w-3xl w-full bg-white rounded-lg relative">
			<div className="flex justify-between items-center w-full p-8">
				<h3 className="text-slate-700 text-3xl font-semibold">{title}</h3>
				<div>
					<div className="rounded-full overflow-hidden flex items-center justify-center">
						{icon && <img className="w-full" src={icon} />}
					</div>
				</div>
			</div>
			<div className="border-t-2 border-bluesky-200 p-8 flex justify-between">
				<div className="w-2/3 pr-5">
					{steps?.map((step, index) => (
						<Step
							index={index}
							stepsLength={steps.length}
							stepInfo={step}
							key={step.title}
							stepIndex={stepIndex}
						/>
					))}
				</div>
				<div className="w-1/4">
					<div className="w-full h-auto rounded-full overflow-hidden opacity-50">
						{steps && <img className="" src={steps[stepIndex].image} />}
					</div>
				</div>
			</div>
			<div className="p-3 border-bluesky border-2 rounded-lg absolute bottom-3 right-3 flex justify-between w-38 items-center text-bluesky gap-2">
				<p>{steps && steps[stepIndex].stepCTA}</p>
				<ArrowRightIcon className="h-5" />
			</div>
		</section>
	);
};

Steps.defaultProps = defaultProps;

export default Steps;
