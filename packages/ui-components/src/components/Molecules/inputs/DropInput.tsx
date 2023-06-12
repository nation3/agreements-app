import React, { useMemo } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import cx from "classnames";

import { FileAddIcon, PaperIcon } from "../../../icons";
import { Body2, IconRenderer } from "../../atoms";

export interface DropInputProps {
	label?: string;
	showFiles?: boolean;
	acceptedFiles?: File[];
	dropzoneConfig?: DropzoneOptions;
	className?: string;
}

const FileLabel = ({ name, color = 'black', background = 'white' }: { name: string, color?: string, background?: string }) => {
	return (
	<div className="flex gap-2 bg-white w-fit rounded pr-2 no-wrap overflow-hidden">
		<IconRenderer icon={PaperIcon} size="small" color={background} background={color}/>
		<Body2 color={color} className="line-clamp-1">{name}</Body2>
	</div>
	)
}

export const DropInput = (props: DropInputProps) => {
	const { label, dropzoneConfig, showFiles, acceptedFiles, className } = props;
	const {
		acceptedFiles: dropzoneAcceptedFiles,
		getRootProps,
		getInputProps,
	} = useDropzone({ ...dropzoneConfig });

	const acceptedFilesCombined = useMemo(() => (
		acceptedFiles && acceptedFiles.length > 0 ? acceptedFiles : dropzoneAcceptedFiles
	), [acceptedFiles, dropzoneAcceptedFiles] );

	return (
		<div>
			{label && (
				<Body2 color="neutral-600" className="mb-2">
					{label}
				</Body2>
			)}
			<div
				{...getRootProps({
					className: cx(
						"flex flex-col items-center justify-center w-full gap-2 p-3 rounded-md",
						"h-20 sm:h-30", // Prevent height flickering
						"font-primary text-neutral-500 bg-neutral-200",
						"border-2 border-dashed",
						"cursor-pointer transition-transform",
						className
					)
				})}
			>
				<input {...getInputProps()} />
				{showFiles && (acceptedFilesCombined && acceptedFilesCombined.length > 0) && (
					<aside className="w-full">
						<ul className="flex flex-col items-center p-2 gap-1 w-full">
							{acceptedFilesCombined.map(({name}, i) => <FileLabel name={name} key={i} color="neutral-600"/>)}
						</ul>
					</aside>
				)}
				{(!acceptedFilesCombined || acceptedFilesCombined.length === 0) && (
					<div className="cursor-pointer">
						<IconRenderer icon={FileAddIcon} color="neutral-500" background="neutral-300" size="large"/>
					</div>
				)}
				<Body2 color="neutral-500" className="hidden sm:inline">
					{"Drag and Drop files here or click to "}
					{!acceptedFilesCombined || acceptedFilesCombined.length === 0 ? "upload" : "replace"}
				</Body2>
			</div>
		</div>
	);
};
