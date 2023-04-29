import { Body3, BodyHeadline, IconRenderer, N3Agreement } from "@nation3/ui-components";
import cx from "classnames";
import React, { useEffect, useState } from "react";
import MarkdownFile from "../MarkdownFile/MarkdownFile";
import { useAgreementCreation } from "./context/AgreementCreationContext";

// eslint-disable-next-line @typescript-eslint/ban-types
type IAgreementPreviewProps = {};

const IAgreementPreviewDefaultProps = {};

const AgreementPreview: React.FC<IAgreementPreviewProps> = (props) => {
	const { title, terms, positions, id, token, setToken, termsHash, fileName } =
		useAgreementCreation();

	const [localTitle, setlocalTitle] = useState<string>("Add agreement name");
	const [localTerms, setlocalTerms] = useState<string>("Add your terms file");
	const [localFileName, setlocalFileName] = useState<string>("");
	const [localToken, setlocalToken] = useState<string>("Select token for collateral");

	useEffect(() => {
		title && setlocalTitle(title);
		terms && setlocalTerms(terms);
		fileName && setlocalFileName(fileName);
		token && setlocalToken(token.symbol);
	}, [fileName, terms, title, token]);

	return (
		<div className={cx("hidden md:block", "lg:col-start-9 xl:col-start-10 lg:col-end-13")}>
			<div className="w-full flex flex-col bg-white rounded-lg">
				<div className="p-base">
					<IconRenderer
						className="mb-min3"
						icon={<N3Agreement />}
						backgroundColor="pr-c-green1"
						size="sm"
						rounded
					/>
					<BodyHeadline color="text-neutral-c-400" className=" mb-min3">
						{localTitle}
					</BodyHeadline>
					{localTerms && localFileName ? (
						<div className="flex mb-min3">
							<MarkdownFile fileName={fileName} markdownText={localTerms} hash={localFileName} />
						</div>
					) : (
						<Body3 color="text-neutral-c-400" className=" mb-min2">
							Add terms file
						</Body3>
					)}
					<Body3 color="text-neutral-c-400" className="mb-min2">
						{localToken}
					</Body3>
					<Body3 color="text-neutral-c-400" className=" mb-min2">
						{token ? token.symbol : "Add participants"}
					</Body3>
				</div>
			</div>
		</div>
	);
};

AgreementPreview.defaultProps = IAgreementPreviewDefaultProps;

export default AgreementPreview;
