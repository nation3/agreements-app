import React, { FC } from "react";
import { createPortal } from "react-dom";

interface ModalNewProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export const ModalNew: FC<ModalNewProps> = ({ isOpen, onClose, children }) => {
	if (!isOpen) {
		return null;
	}

	const modalRoot = document.getElementById("ui-root");

	return createPortal(
		<div
			className="fixed w-screen h-screen inset-0 z-50 flex items-center justify-center p-4 bg-pr-c-green1 bg-opacity-30 backdrop-blur"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-lg p-8 w-full h-full max-w-full mx-auto md:max-w-xl shadow-md overflow-scroll border-2 border-neutral-c-200"
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>,
		modalRoot!,
	);
};
