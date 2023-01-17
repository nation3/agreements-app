import React from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { Button, ButtonProps } from "../Molecules/buttons/Button";
import { useState } from "react";
import { UploadModal, UploadModalProps } from "./modals/UploadModal";

export interface UploadButtonProps
	extends Pick<ButtonProps, "label">,
		Omit<UploadModalProps, "onClose"> {
	heading?: string;
}

export const UploadButton = ({ label, heading, onSubmit }: UploadButtonProps) => {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<Button
				iconLeft={<ArrowUpTrayIcon className="w-5 h-5" />}
				label={label}
				onClick={() => setModalOpen(true)}
			/>
			{modalOpen && (
				<UploadModal
					title={heading ?? label}
					onSubmit={(data) => {
						onSubmit(data);
						setModalOpen(false);
					}}
					onClose={() => setModalOpen(false)}
				/>
			)}
		</>
	);
};
