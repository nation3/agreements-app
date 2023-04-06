import React, { useCallback, useMemo, useState } from "react";
import { useAgreementData } from "./context/AgreementDataContext";
import { PositionMap } from "./context/types";
import { PositionStatusBadge } from "../../components";
import {
	Table,
	ButtonBase,
	ActionBadge,
	utils as n3utils,
	ScreenType,
} from "@nation3/ui-components";
import { utils, BigNumber, constants } from "ethers";
import { Modal } from "flowbite-react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ShareIcon, CheckIcon } from "@heroicons/react/20/solid";
import { CardHeader } from "../CardHeader";
import { AccountDisplay } from "../AccountDisplay";
import { useUrl } from "../../hooks";
import { useTranslation } from "next-i18next";
import { Token } from "./context/types";
import PositionsTable from "../PositionsTable";
import Parties from "../Parties";
import { Card } from "@nation3/ui-components";
import { Headline3 } from "@nation3/ui-components";
import { Body1 } from "@nation3/ui-components";
import { Body2 } from "@nation3/ui-components";
import { AgreementActions } from "../agreement";
import { DisputeActions } from "../dispute";
import { BodyHeadline } from "@nation3/ui-components";
import { Headline2 } from "@nation3/ui-components";
import { Headline4 } from "@nation3/ui-components";

interface AgreementDataDisplayProps {
	id: string;
	title: string;
	status: string;
	termsHash: string;
}

const ShareButton = ({ url }: { url: string }) => {
	const [isShared, setIsShared] = useState<boolean>(false);
	const icon = useMemo(
		() =>
			isShared ? (
				<span className="p-2 hover:bg-bluesky-600/10 rounded-lg">
					<CheckIcon className="w-6 h-6 text-bluesky-600" />
				</span>
			) : (
				<span className="p-2">
					<ShareIcon className="w-6 h-6" />
				</span>
			),
		[isShared],
	);

	const copy = useCallback(async () => {
		try {
			await navigator.share({ url });
		} catch {
			navigator.clipboard.writeText(String(url));
		}
		setIsShared(true);
		setTimeout(() => setIsShared(false), 1000);
	}, [url]);

	return (
		<div>
			<ButtonBase className="bg-transparent hover:bg-gray-50 text-gray-500" onClick={() => copy()}>
				{icon}
			</ButtonBase>
		</div>
	);
};

export const AgreementDataDisplay = ({
	id,
	title,
	status,
	termsHash,
}: AgreementDataDisplayProps) => {
	const { t } = useTranslation("common");
	const [isHashCopied, setIsHashCopied] = useState<boolean>(false);
	const [isAgreementId, setIsAgreementId] = useState<boolean>(false);
	const [isTermsModalUp, setIsTermsModalUp] = useState<boolean>(false);
	const { url: shareUrl } = useUrl();

	const copyAgreementId = useCallback(() => {
		if (id) {
			setIsAgreementId(true);
			navigator.clipboard.writeText(String(id));
			setTimeout(() => setIsAgreementId(false), 1000);
		}
	}, [id]);

	const copyTermsHash = useCallback(() => {
		if (termsHash) {
			setIsHashCopied(true);
			navigator.clipboard.writeText(String(termsHash));
			setTimeout(() => setIsHashCopied(false), 1000);
		}
	}, [termsHash]);

	return (
		<>
			<div className="flex flex-col gap-3 text-gray-700">
				{/* 				<CardHeader
					title={title}
					id={id}
					status={status}
					actions={<ShareButton url={shareUrl} />}
				/> */}
				<div className="flex flex-col md:flex-row gap-1 justify-start md:items-center">
					<ActionBadge
						label="ID"
						tooltip
						tooltipContent={isAgreementId ? "Copied" : "Click to copy"}
						data={n3utils.shortenHash(id ?? constants.HashZero)}
						dataAction={copyAgreementId}
					/>
					<div className="flex items-center">
						<ActionBadge
							tooltip
							tooltipContent={isHashCopied ? "Copied" : "Click to copy"}
							label="Terms hash"
							data={n3utils.shortenHash(termsHash ?? constants.HashZero)}
							icon={<InformationCircleIcon className="w-4 h-4" />}
							iconAction={() => setIsTermsModalUp(true)}
							dataAction={copyTermsHash}
						/>
					</div>
				</div>
			</div>

			{/* TERMS HASH INFO MOCAL */}
			<Modal show={isTermsModalUp} onClose={() => setIsTermsModalUp(false)}>
				<Modal.Header>{t("agreement.termsHash")}</Modal.Header>
				<Modal.Body>
					<div className="space-y-6">
						<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
							{t("agreement.termsHashDescription")}
						</p>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};

export const Agreement = () => {
	const { id, title, status, termsHash, collateralToken, positions } = useAgreementData();
	return (
		<section id="agreement" className="grid grid-cols-12 gap-base z-10 mt-40">
			{/* HEADER */}
			<div className="col-start-1 col-end-13 gap-y-min2">
				<Body2>Agreement</Body2>
				<Headline3 className="pb-0">{title}</Headline3>
			</div>

			{/* CORE AGREEMENT DATA */}
			<div className="col-start-1 col-end-10 flex flex-col w-full text-gray-800">
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
			<div className="p-base w-full bg-white rounded-lg border-2 border-neutral-c-200 col-start-10 col-end-13 flex flex-col justify-center text-gray-800">
				{status == "Disputed" ? <DisputeActions /> : <AgreementActions />}
			</div>
		</section>
	);
};
