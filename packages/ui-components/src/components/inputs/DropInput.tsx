import React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { EyeIcon } from "@heroicons/react/24/outline";
import { IconButton, IconButtonProps } from "../buttons/IconButton";

const PreviewButton = ({ onClick }: Pick<IconButtonProps, "onClick">) => (
	<IconButton icon={<EyeIcon className="w-5 h-5" />} onClick={onClick} />
);

export interface DropInputProps {
	label?: string;
	showFiles?: boolean;
	dropzoneConfig?: DropzoneOptions;
	onPreview?: (content: File) => void;
}

export const DropInput = ({ label, dropzoneConfig, showFiles, onPreview }: DropInputProps) => {
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ ...dropzoneConfig });

	return (
		<div>
			<div
				{...getRootProps({
					className:
						"flex items-center justify-center w-full p-2 py-3 rounded-lg font-primary text-gray-500 bg-gray-50 border-2 border-dashed",
				})}
			>
				<input {...getInputProps()} />
				{label ?? "Drag 'n' drop or click to select file"}
			</div>
			{showFiles && (
				<aside>
					<ul className="p-2">
						{acceptedFiles.map((file) => (
							<li className="flex items-center justify-between" key={file.name}>
								<span className="font-semibold">{file.name}</span>
								{onPreview && (
									<PreviewButton
										onClick={() => {
											onPreview(file);
										}}
									/>
								)}
							</li>
						))}
					</ul>
				</aside>
			)}
		</div>
	);
};
