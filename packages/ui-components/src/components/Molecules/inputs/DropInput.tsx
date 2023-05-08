import { EyeIcon } from "@heroicons/react/24/outline";
import React, { useMemo } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { N3AddFIle } from "../../../icons";
import { N3DocumentGrey } from "../../../icons/index";
import { Body2, IconRenderer } from "../../Atoms";
import { IconButton, IconButtonProps } from "../buttons/IconButton";

const PreviewButton = ({ onClick }: Pick<IconButtonProps, "onClick">) => (
	<IconButton icon={<EyeIcon className="w-5 h-5" />} onClick={onClick} />
);

export interface DropInputProps {
	label?: string;
	value?: string;
	showFiles?: boolean;
	acceptedFiles?: File[];
	dropzoneConfig?: DropzoneOptions;
	onPreview?: (content: File) => void;
}

export const DropInput = (props: DropInputProps) => {
	const { label, dropzoneConfig, showFiles, onPreview, value, acceptedFiles } = props;
	const {
		acceptedFiles: dropzoneAcceptedFiles,
		getRootProps,
		getInputProps,
	} = useDropzone({ ...dropzoneConfig });

	const acceptedFilesData = useMemo(
		() => (acceptedFiles && acceptedFiles.length > 0 ? acceptedFiles : dropzoneAcceptedFiles),
		[acceptedFiles, dropzoneAcceptedFiles],
	);

	return (
		<div>
			<div className="flex gap-min3 items-center">
				{label && (
					<Body2 color="neutral-c-600" className="mb-min2">
						{label}
					</Body2>
				)}
			</div>
			<div
				{...getRootProps({
					className:
						"flex flex-col items-center justify-center w-full px-base py-double font-primary text-neutral-c-500 bg-neutral-c-200 border-2 border-dashed rounded-md",
				})}
			>
				<input {...getInputProps()} />
				{showFiles && (
					<aside>
						<ul className="p-2">
							{acceptedFilesData.map((file, i) => {
								return (
									<div
										key={i}
										className="flex items-center gap-min2 cursor-pointer bg-white w-auto rounded-base pr-min2"
									>
										<IconRenderer
											icon={<N3DocumentGrey />}
											backgroundColor={"neutral-c-300"}
											size={"xs"}
										/>
										<Body2 color="neutral-c-600" className="">
											{file.name}
										</Body2>
									</div>
								);
							})}
						</ul>
					</aside>
				)}
				{(!acceptedFiles || acceptedFiles.length === 0) && (
					<div className="cursor-pointer">
						<IconRenderer icon={<N3AddFIle />} backgroundColor={"neutral-c-300"} size={"sm"} />
					</div>
				)}
				<Body2 color="neutral-c-500 cursor-pointer" className="mt-min2">
					{"Drag and Drop files here or click to "}
					{!acceptedFiles || acceptedFiles.length === 0 ? "upload" : "replace"}
				</Body2>
			</div>
		</div>
	);
};
