import React, { useState, useEffect } from "react";
import { constants } from "ethers";
import Parties from "../Parties";
import { Card, Headline3, Body2, BodyHeadline, Headline4 } from "@nation3/ui-components";
import { AgreementActions } from "../agreement";
import { DisputeActions } from "../dispute";
import cx from "classnames";

const IAgreementSkeletonDefaultProps = {};

const AgreementSkeleton: React.FC = (props) => {
	return (
		<React.Fragment>
			<section
				id="agreement"
				className={cx(
					"grid sm-only:grid-flow-row sm-only:grid-cols-1 sm-only:auto-rows-auto gap-24",
					"md:grid-cols-12 md:gap-24",
					"z-10 mt-40 m-min3",
				)}
			>
				{/* HEADER */}
				<div className={cx("md:col-start-1 md:col-end-13 animate-pulse")}>
					<Body2>Agreement</Body2>
					<div className="h-base+ w-[340px] bg-pr-c-green3 rounded mt-base"></div>
				</div>

				{/* CORE AGREEMENT DATA */}
				<div className={cx("md:col-start-1 md:col-end-10 md:gap-16", "w-full text-gray-800")}>
					{/* Title and details */}
					<Card>
						{/* Participants */}
						<div className="animate-pulse">
							<div className="flex">
								<div className="h-base+ w-[200px] bg-pr-c-green1 rounded mr-base"></div>
								<div className="h-base+ w-[200px] bg-pr-c-green1 rounded mb-base"></div>
							</div>
							<div className="h-double w-[350px] bg-pr-c-green1 rounded mb-base"></div>
							<div>
								<div className="h-base+ w-[200px] bg-pr-c-green2 rounded mb-base"></div>
								<div className="h-[120px] w-full bg-pr-c-green1 rounded mb-base"></div>
								<div className="h-[120px] w-full bg-pr-c-green1 rounded"></div>
							</div>
						</div>
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
							<div className="h-double w-full bg-neutral-c-300 rounded-md mb-base"></div>
						</div>
					</div>
				</div>
			</section>
		</React.Fragment>
	);
};

AgreementSkeleton.defaultProps = IAgreementSkeletonDefaultProps;

export default AgreementSkeleton;
