import { useState } from "react";
import Modal from "../modals/Modal";
import { DropInput } from "../inputs";
import { Button } from "../buttons";

const UploadModal = ({
	title,
	onUpload,
	onClose,
}: {
	title: string;
	onUpload: (file: object) => void;
	onClose: () => void;
}) => {
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
						onDrop: (acceptedFiles: FileList) => {
							acceptedFiles[0].text().then((text: string) => setFile(JSON.parse(text)));
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
							onUpload(file);
						}
					}}
				/>
			</div>
		</Modal>
	);
};

export default UploadModal;
