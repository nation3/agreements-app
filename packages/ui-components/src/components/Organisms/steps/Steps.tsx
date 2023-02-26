import React, { ReactElement } from "react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import cx from "classnames";
import Spinner from "../../Atoms/Spinner";
import { Button } from "../../Molecules/buttons/Button";
import { motion } from "framer-motion";
import { ScreenType, useScreen } from "../../../hooks/useScreen";
import Image from "next/image";

export interface IStep {
	action: () => void | null;
	title: string;
	description: ReactElement | string;
	image: string;
	stepCTA?: string;
}

export type IStepsProps = {
	steps: IStep[];
	icon: string | null;
	title: string;
	isCTAdisabled?: boolean;
	stepIndex: number;
	// Set up as loading if the step in progress. Back to null to stop loading animation.
	isStepLoading?: boolean | undefined;
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
	isLoading: true,
};

type IStepInfo = {
	stepInfo: IStep;
	index: number;
	stepIndex: number;
	isLoading: boolean;
	listLenght: number;
};

const Step = (props: IStepInfo) => {
	const { screen } = useScreen();
	const { stepInfo, index, stepIndex, listLenght, isLoading } = props;

	return (
		<div
			className={cx(
				"flex mb-1 transition-all",
				screen === ScreenType.Desktop && "min-h-[120px]",
				index < stepIndex && "opacity-50",
			)}
		>
			<div className="flex flex-col items-center w-10 mr-5">
				{/* STEP NUMBER BUBBLE */}
				<div
					className={cx(
						"transition-all text-slate-600 font-semibold border-2 w-10 h-10 p-2 m-2 text-sm rounded-full flex items-center justify-center relative",
						index === stepIndex && "border-bluesky ",
					)}
				>
					{index === stepIndex && isLoading && (
						<Spinner className="w-11 h-11 absolute -left-1 -top-1 text-bluesky" />
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
					<p
						className={cx(
							"text-slate-600 text-lg font-semibold mb-2 md:pt-1 pt-4 mr-3",
							index !== stepIndex && "opacity-50",
						)}
					>
						{stepInfo.title}
					</p>
				</div>
				{screen === ScreenType.Mobile && index === stepIndex ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className={cx("text-slate-400 text-sm")}
					>
						{stepInfo.description}
					</motion.div>
				) : screen === ScreenType.Desktop ? (
					<div className={"text-slate-400 text-sm"}>{stepInfo.description}</div>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export const Steps: React.FC<IStepsProps> = (props) => {
	const {
		steps,
		// icon,
		// title,
		stepIndex,
		isStepLoading,
		isCTAdisabled = false,
		areStepsFinished,
		finishImage,
		finishMessage,
		finishAction,
	} = props;

	const stepAction = () => {
		!isCTAdisabled && steps[stepIndex].action();
	};

	return (
		<section className="max-w-3xl w-full bg-white rounded-lg relative shadow-xl">
			{/* <div className="flex justify-between items-center w-full p-8">
				<h3 className="text-slate-600 md:text-3xl text-xl font-semibold">{title}</h3>
				{icon && (
					<div className="overflow-hidden flex items-center justify-center h-1/2">
						<Image className="h-full" width={50} height={50} src={icon} alt={"Join Agreemtent"} />
					</div>
				)}
			</div> */}

			{areStepsFinished ? (
				<div className="p-8 flex flex-col items-center">
					<div className="mb-8">
						<div className="w-32">{finishImage && <img className="" src={finishImage} />}</div>
					</div>
					<div className="mb-6 text-center">{finishMessage}</div>
					<Button className="px-6 w-32" label="Finish" onClick={finishAction} />
				</div>
			) : (
				<div className="pb-24 pt-8 px-8 flex justify-between">
					<div className="w-full pr-16 relative">
						{steps?.map((step, index) => (
							<Step
								key={step.title}
								listLenght={steps.length}
								stepInfo={step}
								stepIndex={stepIndex}
								isLoading={isStepLoading ?? false}
								index={index}
							/>
						))}
					</div>
					<div className="hidden md:block md:w-2/5 relative">
						<div className="w-full relative">
							{steps && <Image width={170} height={170} alt={""} src={steps[stepIndex].image} />}
						</div>
					</div>
				</div>
			)}
			{!areStepsFinished && (
				<div
					onClick={stepAction}
					className={cx(
						"py-3 group transition-all px-5 m-5 border-bluesky border-2 rounded-lg absolute bottom-3 right-3 flex justify-start min-w-[200px] items-center text-bluesky gap-2",
						isStepLoading || isCTAdisabled
							? "opacity-50"
							: "cursor-pointer  hover:bg-bluesky hover:text-white",
					)}
				>
					<p className="">{!areStepsFinished ? steps && steps[stepIndex].stepCTA : "Finish"}</p>
					<ArrowRightIcon
						className={cx(
							isStepLoading && "group-hover:ml-1 group-hover:mr-0 transition-all",
							"mr-1 h-5",
						)}
					/>
				</div>
			)}
			{/* TODO: Use Nation3 Button */}
			{/* 			<Button
				iconRight={
					<ArrowRightIcon className="group-hover:ml-1 group-hover:mr-0 mr-1 h-5 transition-all" />
				}
				className="py-3 group hover:bg-bluesky hover:text-white cursor-pointer transition-all px-5 m-5 border-bluesky border-2 rounded-lg absolute bottom-3 right-3 flex justify-start min-w-[200px] items-center text-bluesky gap-2"
				onClick={() => (!areStepsFinished ? steps && steps[stepIndex].action : finishAction)}
				label={!areStepsFinished ? steps && steps[stepIndex].stepCTA : "Finish"}
			/> */}
		</section>
	);
};

Steps.defaultProps = IStepsDefaultProps;

export default Steps;
