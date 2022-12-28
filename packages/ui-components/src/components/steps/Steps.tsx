import React, { useState, useEffect, ReactElement } from "react";
import { Spinner } from "../svgs";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import cx from "classnames";

interface IStep {
	action: () => void | null;
	title: string;
	description: ReactElement;
	image: string;
	stepCTA?: string;
}

type IStepsProps = {
	steps: IStep[];
	icon: string | null;
	title: string;
	stepIndex: number;
	// Set up as loading if the step in progress. Back to null to stop loading animation.
	loadingIndex?: number | null | undefined;
	areStepsFinished?: boolean;
	finishMessage?: ReactElement | undefined;
	finishImage?: string | undefined;
	finishAction?: () => void | null;
};

/* 
ASYNC STEPS EXAMPLE PROCESS

1. stepIndex = 0;
2. steps[stepIndex].action executes
3. loadingIndex = stepIndex;
4. All actions are successful -> loadingIndex = null
5. stepIndex = 1
6. ... Repeat

X. Want to show a finish screen?
Set finishMessage, finishImage, finishAction props.
Set areStepsFinished = true;
 */

const IStepsDefaultProps = {
	steps: [],
	icon: null,
	title: "Title",
	stepIndex: 0,
	loadingIndex: 0,
};

type IStepInfo = {
	stepInfo: IStep;
	index: number;
	stepIndex: number;
	loadingIndex: number | null | undefined;
	listLenght: number;
};

const Step = (props: IStepInfo) => {
	const { stepInfo, index, stepIndex, listLenght, loadingIndex } = props;

	return (
		<div
			className={cx("flex mb-1 min-h-[120px] transition-all", index < stepIndex && "opacity-50")}
		>
			<div className="flex flex-col items-center w-10 mr-5">
				{/* STEP NUMBER BUBBLE */}
				<div
					className={cx(
						"transition-all text-slate-600 font-semibold border-2 w-10 h-10 p-2 m-2 text-sm rounded-full flex items-center justify-center relative",
						index === stepIndex && loadingIndex !== index && "border-bluesky ",
					)}
				>
					{index === loadingIndex && (
						<Spinner className="w-full h-full absolute left-0 top-0 text-bluesky" />
					)}
					{index + 1}
				</div>

				{/* STEP LINE */}
				{index !== listLenght - 1 && (
					<div className={cx("w-[2px] transition-all rounded-full h-full bg-slate-200")}></div>
				)}
			</div>

			{/* STEP TITLE & DESCRIPTION */}
			<div>
				<div className="flex items-center">
					<p className="text-slate-600 text-lg font-semibold mb-2 pt-1 mr-3">{stepInfo.title}</p>
				</div>
				<div className={"text-slate-400 text-sm"}>{stepInfo.description}</div>
			</div>
		</div>
	);
};

const Steps: React.FC<IStepsProps> = (props) => {
	const {
		steps,
		icon,
		title,
		stepIndex,
		loadingIndex,
		areStepsFinished,
		finishImage,
		finishMessage,
		finishAction,
	} = props;

	return (
		<section className="max-w-3xl w-full bg-white rounded-lg relative">
			<div className="flex justify-between items-center w-full p-8 pl-10">
				<h3 className="text-slate-600 text-3xl font-semibold">{title}</h3>
				{icon && (
					<div>
						<div className="rounded-full overflow-hidden flex items-center justify-center">
							<img className="w-full" src={icon} />
						</div>
					</div>
				)}
			</div>
			{areStepsFinished ? (
				<div className="border-t-2 border-bluesky-200 p-8 flex flex-col">
					<div className="">{finishMessage}</div>
					<div className="pt-5 pb-16">
						<div className="w-full rounded-lg overflow-hidden">
							{finishImage && <img className="" src={finishImage} />}
						</div>
					</div>
				</div>
			) : (
				<div className="border-t-2 border-bluesky-200 p-8 pb-16 flex justify-between">
					<div className="w-2/3 pr-5">
						{steps?.map((step, index) => (
							<Step
								key={step.title}
								listLenght={steps.length}
								stepInfo={step}
								stepIndex={stepIndex}
								loadingIndex={loadingIndex}
								index={index}
							/>
						))}
					</div>
					<div className="w-1/4">
						<div className="w-full h-auto rounded-full overflow-hidden opacity-50">
							{steps && <img className="" src={steps[stepIndex].image} />}
						</div>
					</div>
				</div>
			)}
			<div
				onClick={!areStepsFinished ? steps && steps[stepIndex].action : finishAction}
				className="py-3 group hover:bg-bluesky hover:text-white cursor-pointer transition-all px-5 m-5 border-bluesky border-2 rounded-lg absolute bottom-3 right-3 flex justify-start min-w-[200px] items-center text-bluesky gap-2"
			>
				<p className="">{!areStepsFinished ? steps && steps[stepIndex].stepCTA : "Finish"}</p>
				<ArrowRightIcon className="group-hover:ml-1 group-hover:mr-0 mr-1 h-5 transition-all" />
			</div>
		</section>
	);
};

Steps.defaultProps = IStepsDefaultProps;

export default Steps;
