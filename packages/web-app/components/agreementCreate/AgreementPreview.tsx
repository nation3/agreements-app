import { Body3, BodyHeadline, IconRenderer, N3Agreement } from "@nation3/ui-components";
import cx from "classnames";
import React, { useEffect, useState } from "react";
import MarkdownFile from "../MarkdownFile/MarkdownFile";
import TokenRenderer from "../TokenRenderer";
import { useAgreementCreation } from "./context/AgreementCreationContext";
import { InputPositionList } from "./context/types";

// eslint-disable-next-line @typescript-eslint/ban-types
type IAgreementPreviewProps = {};

const IAgreementPreviewDefaultProps = {};

const AgreementPreview: React.FC<IAgreementPreviewProps> = (props) => {
	const { title, terms, positions, id, token, setToken, termsHash, fileName } =
		useAgreementCreation();

	const [localTitle, setlocalTitle] = useState<string>("Add agreement name");
	const [localTerms, setlocalTerms] = useState<string>("Add your terms file");
	const [localPositions, setlocalPositions] = useState<InputPositionList>(positions);

	const [localFileName, setlocalFileName] = useState<string>("");
	const [localToken, setlocalToken] = useState<string>("Select token for collateral");

	useEffect(() => {
		title && setlocalTitle(title);
		terms && setlocalTerms(terms);
		fileName && setlocalFileName(fileName);
		token && setlocalToken(token.symbol);
		positions && setlocalPositions(positions);
	}, [fileName, terms, title, token]);

	return (
		<div className={cx("hidden md:block", "lg:col-start-9 xl:col-start-10 lg:col-end-13")}>
			<div className="w-full flex flex-col bg-white rounded-lg">
				<div className="p-base flex flex-col gap-min3">
					<IconRenderer
						className=""
						icon={<N3Agreement />}
						backgroundColor="pr-c-green1"
						size="sm"
						rounded
					/>
					<BodyHeadline color="text-neutral-c-400" className=" ">
						{localTitle}
					</BodyHeadline>
					{localTerms && localFileName ? (
						<div className="flex ">
							<MarkdownFile fileName={fileName} markdownText={localTerms} hash={localFileName} />
						</div>
					) : (
						<Body3 color="text-neutral-c-400" className=" mb-min2">
							Add terms file
						</Body3>
					)}
					<div>
						<TokenRenderer tokenSymbol={localToken} />
					</div>
					{/* 
                    {localPositions.length > 0 ? (
						<div className="flex flex-col mb-min2 gap-min2">
							{localPositions.map(({ account, balance }, index) => (
								<div className="flex justify-between" key={index}>
									<AccountDisplay key={index} address={account} />
									<Body3>
										{utils.formatUnits(BigNumber.from(balance))}
									</Body3>
								</div>
							))}
						</div>
					) : ( 
                        */}
					<Body3 color="text-neutral-c-400" className=" mb-min2">
						Add participants
					</Body3>
					{/* )} */}
				</div>
			</div>
		</div>
	);
};

AgreementPreview.defaultProps = IAgreementPreviewDefaultProps;

export default AgreementPreview;
