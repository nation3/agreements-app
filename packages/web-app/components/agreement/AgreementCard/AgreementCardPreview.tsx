import React from "react";
import { BodyHeadline, Body3 } from "@nation3/ui-components";
import AgreementCardBase from "./AgreementCardBase";
import TokenRenderer from "../../TokenRenderer";
import { BigNumber, BigNumberish, utils } from "ethers";
import { AccountDisplay } from "../../AccountDisplay";
import type { TokenDisplay, InputPositionList } from "../../types";
import MarkdownFile, { MarkdownFileProps } from "../../MarkdownFile/MarkdownFile";

interface TermsProps {
	fileName: string;
	terms: string;
	termsHash: string;
	fileStatus: string;
}

export interface AgreementCardPreviewProps extends TermsProps {
	title: string;
	positions: InputPositionList;
	token: TokenDisplay;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
	return (
		<div className="flex items-center gap-min2 cursor-default">
			<div className="border-2 border-neutral-c-200 w-auto rounded-base px-min2 h-full bg-white">
				<Body3 color="neutral-c-500" className="text-xs">
					{status}
				</Body3>
			</div>
		</div>
	);
};

const TermsSection: React.FC<MarkdownFileProps> = (props) => {
	const { fileStatus } = props;

	return (
		<div className="flex flex-wrap gap-min3">
			<MarkdownFile {...props} fileStatus={fileStatus ? fileStatus : "private"} />
			<StatusBadge status={fileStatus} />
		</div>
	);
};

const PartySectionItem: React.FC<{ account: string; balance: BigNumberish }> = ({
	account,
	balance,
}) => {
	return (
		<div className="flex justify-between">
			<AccountDisplay address={account} />
			<Body3>{utils.formatUnits(BigNumber.from(balance))}</Body3>
		</div>
	);
};

interface PartiesSectionProps {
	positions: InputPositionList;
}

// FIXME: This is not SSR safe
const PartiesSection: React.FC<PartiesSectionProps> = ({ positions }) => {
	return (
		<>
			<div className="flex justify-between">
				<Body3 color="neutral-c-400">Parties</Body3>
				<Body3 color="neutral-c-400">Collateral</Body3>
			</div>
			<div className="flex flex-col mb-min2 gap-min2">
				{positions.map(({ account, balance }, index) => (
					<PartySectionItem key={index} account={account} balance={balance} />
				))}
			</div>
		</>
	);
};

const AgreementCardPreview: React.FC<AgreementCardPreviewProps> = (props) => {
	const { title, fileName, terms, termsHash, fileStatus, positions, token } = props;

	return (
		<AgreementCardBase>
			<BodyHeadline color="text-neutral-c-400">{title}</BodyHeadline>
			<TermsSection
				fileName={fileName}
				termsFile={terms}
				hash={termsHash}
				fileStatus={fileStatus}
				isCreating={true}
			/>
			<TokenRenderer tokenSymbol={token?.symbol} />
			<PartiesSection positions={positions} />
		</AgreementCardBase>
	);
};

export default AgreementCardPreview;
