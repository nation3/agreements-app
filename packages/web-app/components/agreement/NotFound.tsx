import React, { useState, useEffect } from "react";
import {
	WarnDocumentOrange,
	Card,
	Headline3,
	Body2,
	BodyHeadline,
	Headline4,
	Body3,
} from "@nation3/ui-components";
import cx from "classnames";
import NoActions from "./actions/NoActions";

const INotFoundAgreementDefaultProps = {};

const NotFoundAgreement: React.FC = (props) => {
	return (
		<>
			{/* TODO: REFACTOR BUILD SPECIFIC COMPONENT */}
			<section
				id="agreement"
				className={cx(
					"grid sm-only:grid-flow-row sm-only:grid-cols-1 sm-only:auto-rows-auto gap-24",
					"md:grid-cols-12 md:gap-24",
					"z-10 mt-40 m-min3",
				)}
			>
				{/* HEADER */}
				<div className={cx("md:col-start-1 md:col-end-13 ")}>
					<Body2>Agreement</Body2>
					<Headline3 className="pb-0">Not found</Headline3>
				</div>

				{/* CORE AGREEMENT DATA */}
				<div className={cx("md:col-start-1 md:col-end-10 md:gap-16", "w-full text-gray-800")}>
					{/* Title and details */}
					<Card className="flex justify-center flex-col c-gradient-warn">
						{/* Participants */}
						<WarnDocumentOrange className="h-[150px] w-[150px] mb-base" />
						<Headline4 className="pb-min3">Not existing agreement</Headline4>
						<Body3 className="pb-base">Check the correct agreement id or url</Body3>
					</Card>
				</div>

				{/* AGREEMENT ACTIONS */}
				<div
					className={cx(
						// "sticky bottom-base",
						"md:col-start-10 md:col-end-13",
					)}
				>
					<div className="w-full flex flex-col bg-white rounded-lg border-2 border-neutral-c-200">
						<div className="border-b-2 border-neutral-c-200 p-base">
							<BodyHeadline>Available Actions</BodyHeadline>
						</div>
						<div className="p-base">
							<NoActions />
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

NotFoundAgreement.defaultProps = INotFoundAgreementDefaultProps;

export default NotFoundAgreement;
