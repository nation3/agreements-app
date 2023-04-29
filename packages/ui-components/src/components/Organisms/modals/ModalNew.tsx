import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalNewProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export const ModalNew: FC<ModalNewProps> = ({ isOpen, onClose, children }) => {
	const modalRoot = document.getElementById("ui-root");

	const transition = { duration: 0.2 };
	const transitionBlur = { duration: 0.15 };

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			document.body.classList.add("overflow-hidden");
			document.addEventListener("keydown", handleKeyDown);
		} else {
			document.body.classList.remove("overflow-hidden");
		}

		return () => {
			document.body.classList.remove("overflow-hidden");
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key="modal-backdrop"
					initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
					animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
					exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
					transition={transitionBlur}
					className="transition-all fixed w-screen h-screen inset-0 z-50 flex items-center justify-center p-4 bg-pr-c-green1 bg-opacity-30"
					onClick={isOpen && onClose}
				>
					<motion.div
						key="modal-content"
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={transition}
						className="w-auto"
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		modalRoot!,
	);
};
