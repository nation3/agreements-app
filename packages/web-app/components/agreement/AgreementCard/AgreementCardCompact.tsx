import AgreementCardBase from "./AgreementCardBase";
import {
	BodyHeadline,
	Body3,
	IconRenderer,
	N3StatusIcon,
	N3Document,
	utils as n3utils,
} from "@nation3/ui-components";
import TokenRenderer from "../../TokenRenderer";
import type { TokenDisplay } from "../../types";

interface IconLabelProps {
	icon: React.ReactNode;
	label: React.ReactNode;
}

const IconLabel: React.FC<IconLabelProps> = ({ icon, label }) => {
	return (
		<div className="flex w-auto rounded-base pr-min2 h-full bg-white items-center gap-min2">
			{icon}
			<Body3>{label}</Body3>
		</div>
	);
};

const StatusLabel: React.FC<{ status: string }> = ({ status }) => {
	return (
		<IconLabel
			icon={<IconRenderer icon={<N3StatusIcon />} backgroundColor={"neutral-c-300"} size={"xs"} />}
			label={
				<>
					<span className="text-neutral-c-400">Status:</span> {status}
				</>
			}
		/>
	);
};

interface TermsDisplayProps {
	fileName: string;
	termsHash: string;
	fileStatus: string;
}

const FileLabel: React.FC<{ fileName: string }> = ({ fileName }) => {
	return (
		<IconLabel
			icon={<IconRenderer icon={<N3Document />} backgroundColor={"pr-c-green1"} size={"xs"} />}
			label={fileName}
		/>
	);
};

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

const TermsDisplay: React.FC<TermsDisplayProps> = ({ fileName, termsHash, fileStatus }) => {
	return (
		<div className="flex">
			<FileLabel fileName={fileName || n3utils.shortenHash(termsHash)} />
			<StatusBadge status={fileStatus} />
		</div>
	);
};

export interface AgreementCardCompactProps {
	title: string;
	status: string;
	fileName: string;
	termsHash: string;
	fileStatus: string;
	token: TokenDisplay;
}

const AgreementCardCompact: React.FC<AgreementCardCompactProps> = (props) => {
	const { title, status, fileName, termsHash, fileStatus, token } = props;

	return (
		<AgreementCardBase>
			<BodyHeadline color="text-neutral-c-400">{title}</BodyHeadline>
			<div className="flex flex-col gap-min2">
				<StatusLabel status={status} />
				<TermsDisplay fileName={fileName} termsHash={termsHash} fileStatus={fileStatus} />
				<TokenRenderer tokenSymbol={token?.symbol} />
			</div>
		</AgreementCardBase>
	);
};

export default AgreementCardCompact;
