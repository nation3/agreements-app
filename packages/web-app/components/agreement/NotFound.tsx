import {
	Body2,
	Body3,
	BodyHeadline,
	Card,
	Headline3,
	WarnDocumentOrange,
} from "@nation3/ui-components";
import cx from "classnames";
import React from "react";
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
					<Card className="flex justify-center flex-col c-gradient-warn border-sc-c-orange1">
						{/* Participants */}
						<WarnDocumentOrange className="h-[150px] w-[150px] mb-base" />
						<BodyHeadline className="mb-min2">This agreement does not exist</BodyHeadline>
						<Body3 color="neutral-c-500" className="">
							Check the correct agreement id or url
						</Body3>
					</Card>
				</div>

				{/* AGREEMENT ACTIONS */}
				<div
					className={cx(
						// "sticky bottom-base",
						"md:col-start-10 md:col-end-13 ",
					)}
				>
					<div className="w-full flex flex-col bg-white rounded-lg border-2 border-sc-c-orange1">
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
