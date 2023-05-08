import { useCallback, useState } from "react";
import { ActionBadge, utils as n3utils } from "@nation3/ui-components";
import { constants } from "ethers";
import { Modal } from "flowbite-react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useUrl } from "../../hooks";
import { useTranslation } from "next-i18next";

interface AgreementDataDisplayProps {
	id: string;
	title: string;
	status: string;
	termsHash: string;
}

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
			<div className="flex lg:flex-row flex-col gap-3 text-gray-700 mb-min2">
				{/* 				<CardHeader
					title={title}
					id={id}
					status={status}
					actions={<ShareButton url={shareUrl} />}
				/> */}
				<div className="flex flex-col lg:flex-row gap-1 justify-start lg:items-center mr-min1">
					<ActionBadge
						label="ID"
						tooltip
						tooltipContent={isAgreementId ? "Copied" : "Click to copy"}
						data={n3utils.shortenHash(id ?? constants.HashZero)}
						dataAction={copyAgreementId}
					/>
				</div>
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
