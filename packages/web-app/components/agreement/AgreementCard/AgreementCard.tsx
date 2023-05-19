import { ReactNode } from "react";
import {
	Body3,
	BodyHeadline,
	Card,
	IllustrationRenderer,
	N3AgreementDone,
	ScreenType,
	useScreen,
} from "@nation3/ui-components";
import { BigNumber, BigNumberish, utils } from "ethers";
import { motion } from "framer-motion";
import React from "react";
import { AccountDisplay } from "../../AccountDisplay";
import MarkdownFile, { MarkdownFileProps } from "../../MarkdownFile/MarkdownFile";
import TokenRenderer from "../../TokenRenderer";
import { InputPositionList } from "../../agreementCreate/context/types";
import AgreementStatus from "../AgreementStatus";
import { Token } from "../context/types";

type IAgreementCardProps = {
	id: string;
	title: string;
	status: string;
	token: Token;
	terms: string;
	termsHash: string;
	fileName: string;
	fileStatus: string;
	positions: InputPositionList;
};

const IAgreementCardDefaultProps = {};

const TermsSection: React.FC<MarkdownFileProps> = (props) => {
	const { fileStatus } = props;

	return (
		<div className="flex flex-wrap gap-min3">
			<MarkdownFile {...props} fileStatus={fileStatus ? fileStatus : "private"} />
			<AgreementStatus fileStatus={fileStatus} />
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

const AgreementCard: React.FC<IAgreementCardProps> = (props) => {
	const { status, title, terms, termsHash, fileName, fileStatus, positions, token } = props;

	return (
		<AgreementCardBase>
			<TermsSection
				fileName={fileName}
				termsFile={terms}
				hash={termsHash}
				fileStatus={fileStatus}
				isCreating={status == "Preview"}
			/>
			<TokenRenderer tokenSymbol={token?.symbol} />
			<BodyHeadline color="text-neutral-c-400">{title}</BodyHeadline>
			<PartiesSection positions={positions} />
		</AgreementCardBase>
	);
};

interface CardProps {
	children: ReactNode;
}

const AgreementCardBase: React.FC<CardProps> = ({ children }) => {
	const { screen } = useScreen();
	// useEffect(() => {}, []);

	return (
		<motion.div
			className="w-full rounded-lg"
			initial={{ opacity: 0, y: -10, boxShadow: "0px 0px 0 rgba(0, 0, 0, 0.0)" }}
			animate={{
				opacity: 1,
				y: 0,
				boxShadow: `0px ${screen == ScreenType.Desktop ? "2px 6px" : "1px 4px"} rgba(0, 0, 0, 0.1)`,
			}}
			transition={{ duration: 0.15 }}
		>
			<Card size="base" className="p-[0px] sm:p-min3 md:p-base flex flex-col gap-min3 w-full">
				<IllustrationRenderer customSize={60} icon={<N3AgreementDone />} size="sm" />
				{children}
			</Card>
		</motion.div>
	);
};

AgreementCard.defaultProps = IAgreementCardDefaultProps;

export default AgreementCard;
