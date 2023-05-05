import {
	Body2,
	Body3,
	Card,
	Headline3,
	HeadlineBasic,
	utils as n3utils,
} from "@nation3/ui-components";
import cx from "classnames";
import { constants } from "ethers";
import { AgreementActions } from ".";
import Parties from "../Parties";
import { DisputeActions } from "../dispute";
import AgreementSkeleton from "./AgreementSkeleton";
import AgreementTermsData from "./AgreementTermsData";
import NotFoundAgreement from "./NotFound";
import { useAgreementData } from "./context/AgreementDataContext";

export const AgreementView = () => {
	const {
		id,
		title,
		status,
		termsHash,
		collateralToken,
		positions,
		isLoading,
		fileName,
		fileStatus,
		termsFile,
	} = useAgreementData();
	console.log("terms", termsHash);

	return isLoading ? (
		<AgreementSkeleton />
	) : !termsHash && !isLoading ? (
		<NotFoundAgreement />
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
				<Card className="flex flex-col gap-base">
					{/* Participants */}
					<HeadlineBasic className="">Agreements terms</HeadlineBasic>

					<AgreementTermsData
						id={id}
						title={title || "Agreement"}
						status={status || "Unknonw"}
						termsHash={termsHash || constants.HashZero}
						fileName={fileName}
						fileStatus={fileStatus}
						termsFile={termsFile}
					/>

					{/* Participants */}
					<div>
						<HeadlineBasic className="mb-min3">Positions & Stakes</HeadlineBasic>
						<Parties token={collateralToken} positions={positions} />
					</div>
				</Card>
			</div>
			{/* AGREEMENT ACTIONS */}
			<div
				className={cx(
					// "sticky bottom-base",
					"lg:col-start-9 xl:col-start-10 lg:col-end-13 flex flex-col gap-base",
				)}
			>
				<div className="w-full flex flex-col bg-white rounded-lg border-2 border-neutral-c-200">
					<div className="border-b-2 border-neutral-c-200 p-base">
						<Body2 color="neutral-c-500">Available Actions</Body2>
					</div>
					<div className="p-base">
						{status == "Disputed" ? <DisputeActions /> : <AgreementActions />}
					</div>
				</div>
				<Card size="base" className="flex flex-col gap-min2">
					<div className=" flex  w-auto rounded-base px-min2 h-full bg-white">
						<Body3>
							<span className="text-neutral-c-400 mr-min2">ID</span>{" "}
							{n3utils.shortenHash(id ?? constants.HashZero)}
						</Body3>
					</div>
					<div className=" flex  w-auto rounded-base px-min2 h-full bg-white">
						<Body3>
							<span className="text-neutral-c-400 mr-min2">Status</span> {status}
						</Body3>
					</div>
				</Card>
			</div>
		</section>
	);
};
