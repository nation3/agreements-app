import React, { ReactNode, useState } from "react";
import { Modal, ModalProps } from "./Modal";
import { DropInput } from "../../Molecules/inputs/DropInput";
import { Button } from "../../Molecules/buttons";

export interface UploadModalProps extends Omit<ModalProps, "children"> {
	title?: ReactNode;
	onSubmit: (file: object) => void;
}

export const UploadModal = ({ title, onSubmit, onClose }: UploadModalProps) => {
	const [file, setFile] = useState<object>();

	return (
		<Modal onClose={onClose}>
			<div className="flex flex-col gap-3">
				<h3 className="px-4 text-lg font-bold">{title}</h3>
				<DropInput
					label="Drag 'n' drop or click to select file"
					dropzoneConfig={{
						accept: {
							"application/json": [],
						},
						maxFiles: 1,
						onDrop: (acceptedFiles: File[]) => {
							acceptedFiles[0]
								.text()
								.then((text: string) => setFile(JSON.parse(text)))
								.catch((error) => {
									console.log(error);
								});
						},
					}}
				/>
				<div className="prose prose-n3 ">
					<pre>
						<code>{JSON.stringify(file, null, 2)}</code>
					</pre>
				</div>
				<Button
					label={"Confirm"}
					onClick={() => {
						if (file) {
							onSubmit(file);
						}
					}}
				/>
			</div>
		</Modal>
	);
};
