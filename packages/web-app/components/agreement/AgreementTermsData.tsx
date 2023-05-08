import { Body3, utils as n3utils } from "@nation3/ui-components";
import { constants } from "ethers";
import React from "react";
import MarkdownFile from "../MarkdownFile/MarkdownFile";
import AgreementStatus from "./AgreementStatus";

type IAgreementTermsDataProps = {
	id: string;
	title: string;
	status: string;
	termsHash: string;
	fileName: string | undefined;
	fileStatus: string | undefined;
	termsFile: string | undefined;
};

const IAgreementTermsDataDefaultProps = {};

const AgreementTermsData: React.FC<IAgreementTermsDataProps> = (props) => {
	const { id, title, status, termsHash, fileName, fileStatus, termsFile } = props;

	return (
		<section className="flex flex-wrap gap-min3 bg-neutral-c-200 px-min3 py-min3 md:py-base rounded-md">
			<div className="flex">
				<MarkdownFile
					termsFile={termsFile ? termsFile : ""}
					fileName={fileName ? fileName : ""}
					hash={termsHash ? termsHash : ""}
					fileStatus={fileStatus ? fileStatus : "private"}
				/>
			</div>
			<AgreementStatus fileStatus={fileStatus ? fileStatus : ""} />
			{termsHash && (
				<div className="border-2 border-neutral-c-200 w-auto rounded-base px-min2 h-full bg-white">
					<Body3 color="neutral-c-700" className="text-xs">
						<span className="text-neutral-c-400 mr-min3">File hash</span>
						{n3utils.shortenHash(termsHash ?? constants.HashZero)}
					</Body3>
				</div>
			)}
		</section>
	);
};

AgreementTermsData.defaultProps = IAgreementTermsDataDefaultProps;

export default AgreementTermsData;
