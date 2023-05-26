import {
	Body2,
	Body3,
	BodyHeadline,
	Card,
	Headline3,
	HeadlineBasic,
	IconRenderer,
	N3IdIcon,
	N3StatusIcon,
	N3TypeIcon,
	ShareButton,
	utils as n3utils,
} from "@nation3/ui-components";
import cx from "classnames";
import { constants } from "ethers";
import { AgreementActions } from ".";
import { useActiveURL } from "../../hooks";
import Parties from "../Parties";
import { DisputeActions, ResolutionDetails } from "../dispute";
import AgreementSkeleton from "./AgreementSkeleton";
import AgreementTermsData from "./AgreementTermsData";
import NotFoundAgreement from "./NotFound";
import { useAgreementData } from "./context/AgreementDataContext";
import AgreementsGrid from "./../layout/agreements/Grid";

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
	const activeURL = useActiveURL();

	return isLoading ? (
		<AgreementSkeleton />
	) : !termsHash && !isLoading ? (
		<NotFoundAgreement />
	) : (
		<AgreementsGrid id="agreement">
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
				{/* DISPUTE DATA */}
				<ResolutionDetails />

				{/* Title and details */}
				<Card
					className={cx("flex flex-col gap-base", status === "Disputed" && "border-sc-c-orange1")}
				>
					<div className="flex gap-base mb-base flex-col md:flex-row justify-between relative">
						<div className="flex flex-wrap gap-min3 w-1/2 md:w-full">
							<div className=" flex  w-auto rounded-base pr-min2 h-full bg-white items-center gap-min2">
								<IconRenderer
									icon={<N3StatusIcon />}
									backgroundColor={"neutral-c-300"}
									size={"xs"}
								/>
								<Body3>
									<span className="text-neutral-c-400 mr-min2">Status</span> {status}
								</Body3>
							</div>
							<div className=" flex  w-auto rounded-base pr-min2 h-full bg-white items-center gap-min2">
								<IconRenderer icon={<N3IdIcon />} backgroundColor={"pr-c-green1"} size={"xs"} />
								<Body3>
									<span className="text-neutral-c-400 mr-min2">ID</span>{" "}
									{n3utils.shortenHash(id ?? constants.HashZero)}
								</Body3>
							</div>
							<div className=" flex  w-auto rounded-base pr-min2 h-full bg-white items-center gap-min2">
								<IconRenderer icon={<N3TypeIcon />} backgroundColor={"pr-c-green1"} size={"xs"} />
								<Body3>
									<span className="text-neutral-c-400 mr-min2">Type</span> Collateral
								</Body3>
							</div>
						</div>
						<div className="absolute top-0 right-0 md:relative">
							<ShareButton url={activeURL} />
						</div>
					</div>
					{/* Participants */}
					<BodyHeadline className="">Agreements terms</BodyHeadline>

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
				<div
					className={cx(
						"w-full flex flex-col bg-white rounded-lg border-2 border-neutral-c-200",
						status === "Disputed" && "border-sc-c-orange1",
					)}
				>
					<div
						className={cx(
							"border-b-2 border-neutral-c-200 p-base",
							status === "Disputed" && "border-sc-c-orange1",
						)}
					>
						<Body2 color="neutral-c-700">Available Actions</Body2>
					</div>
					<div className="p-base">
						{status == "Disputed" ? <DisputeActions /> : <AgreementActions />}
					</div>
				</div>
				{/* 				<Card
					size="base"
					className={cx("flex flex-col gap-min2", status === "Disputed" && "border-sc-c-orange1")}
				>
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
				</Card> */}
			</div>
		</AgreementsGrid>
	);
};
