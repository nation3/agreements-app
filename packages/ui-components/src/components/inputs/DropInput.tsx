import React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";

export interface DropInputProps {
	label?: string;
	dropzoneConfig?: DropzoneOptions;
}

export const DropInput = ({ label, dropzoneConfig }: DropInputProps) => {
	const { getRootProps, getInputProps } = useDropzone({ ...dropzoneConfig });

	return (
		<div
			{...getRootProps({
				className:
					"flex items-center justify-center w-full p-2 py-3 rounded-lg font-primary text-gray-500 bg-gray-50 border-2 border-dashed",
			})}
		>
			<input {...getInputProps()} />
			{label ?? "Drag 'n' drop or click to select file"}
		</div>
	);
};
