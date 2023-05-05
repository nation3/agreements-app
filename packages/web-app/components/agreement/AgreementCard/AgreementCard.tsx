import { Body3, BodyHeadline, Card, N3AgreementDone } from "@nation3/ui-components";
import { BigNumber, utils } from "ethers";
import { motion } from "framer-motion";
import React from "react";
import IllustrationRenderer from "../../../../ui-components/src/components/Atoms/IllustrationRenderer";
import { AccountDisplay } from "../../AccountDisplay";
import MarkdownFile from "../../MarkdownFile/MarkdownFile";
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

const AgreementCard: React.FC<IAgreementCardProps> = (props) => {
	const { id, title, terms, status, termsHash, fileName, fileStatus, positions, token } = props;

	// useEffect(() => {}, []);

	return (
		<motion.div
			className="w-full rounded-lg"
			initial={{ opacity: 0, y: -10, boxShadow: "0px 0px 0 rgba(0, 0, 0, 0.0)" }}
			animate={{ opacity: 1, y: 0, boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)" }}
			transition={{ duration: 0.15 }}
		>
			<Card size="base" className="p-min3 md:p-base flex flex-col gap-min3 w-full">
				<IllustrationRenderer customSize={60} icon={<N3AgreementDone />} size="sm" />
				<div className="flex gap-min3">
					<MarkdownFile
						fileName={fileName}
						termsFile={terms}
						hash={fileName}
						fileStatus={fileStatus ? fileStatus : "private"}
					/>
					<AgreementStatus fileStatus={fileStatus} />
				</div>
				<TokenRenderer tokenSymbol={token?.symbol} />
				<BodyHeadline color="text-neutral-c-400">{title}</BodyHeadline>
				<div className="flex justify-between">
					<Body3 color="neutral-c-400">Parties</Body3>
					<Body3 color="neutral-c-400">Collateral</Body3>
				</div>
				<div className="flex flex-col mb-min2 gap-min2">
					{positions.map(({ account, balance }, index) => (
						<div className="flex justify-between" key={index}>
							<AccountDisplay key={index} address={account} />
							<Body3>
								{utils.formatUnits(BigNumber.from(balance))}
								{/* ${token?.symbol ?? ""} */}
							</Body3>
						</div>
					))}
				</div>
			</Card>
		</motion.div>
	);
};

AgreementCard.defaultProps = IAgreementCardDefaultProps;

export default AgreementCard;
