import { useAgreementData } from "./context/AgreementDataContext";
import { constants } from "ethers";
import Parties from "../Parties";
import { Card } from "@nation3/ui-components";
import { Headline3 } from "@nation3/ui-components";
import { Body2 } from "@nation3/ui-components";
import { AgreementActions } from ".";
import { DisputeActions } from "../dispute";
import { BodyHeadline } from "@nation3/ui-components";
import { Headline4 } from "@nation3/ui-components";
import cx from "classnames";
import NotFoundAgreement from "./NotFound";
import AgreementSkeleton from "./AgreementSkeleton";
import { AgreementDataDisplay } from "./AgreementDataDisplay";

export const AgreementView = () => {
	const { id, title, status, termsHash, collateralToken, positions, isLoading } =
		useAgreementData();
	console.log("terms", termsHash);

	return !termsHash && !isLoading ? (
		<NotFoundAgreement />
	) : isLoading ? (
		<AgreementSkeleton />
	) : (
		<section
			id="agreement"
			className={cx(
				"grid grid-flow-row grid-cols-1 auto-rows-auto gap-16",
				"lg:grid-cols-lg lg:gap-24",
				"xl:grid-cols-xl",
				"z-10 mt-40 m-min3",
			)}
		>
			{/* HEADER */}
			<div className={cx("lg:col-start-1 lg:col-end-13 ")}>
				<Body2>Agreement</Body2>
				<Headline3 className="pb-0">{title}</Headline3>
			</div>
			{/* CORE AGREEMENT DATA */}
			<div
				className={cx(
					"lg:col-start-1 lg:col-end-9 xl:col-end-10 lg:gap-16",
					"w-full text-gray-800",
				)}
			>
				{/* Title and details */}
				<Card>
					<AgreementDataDisplay
						id={id}
						title={title || "Agreement"}
						status={status || "Unknonw"}
						termsHash={termsHash || constants.HashZero}
					/>

					{/* Participants */}
					<Headline4 className="pb-base">Positions & Stakes</Headline4>
					<Parties token={collateralToken} positions={positions} />
				</Card>
			</div>
			{/* AGREEMENT ACTIONS */}
			<div
				className={cx(
					// "sticky bottom-base",
					"lg:col-start-9 xl:col-start-10 lg:col-end-13",
				)}
			>
				<div className="w-full flex flex-col bg-white rounded-lg border-2 border-neutral-c-200">
					<div className="border-b-2 border-neutral-c-200 p-base">
						<BodyHeadline>Available Actions</BodyHeadline>
					</div>
					<div className="p-base">
						{status == "Disputed" ? <DisputeActions /> : <AgreementActions />}
					</div>
				</div>
			</div>
		</section>
	);
};
