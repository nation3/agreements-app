import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useEffect } from "react";
import { createPortal } from "react-dom";
import { ScreenType, useScreen } from "../../../hooks/useScreen";

interface ModalNewProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export const ModalNew: FC<ModalNewProps> = ({ isOpen, onClose, children }) => {
	const modalRoot = document.getElementById("ui-root");

	const transition = { duration: 0.2 };
	const transitionBlur = { duration: 0.15 };
	const { screen } = useScreen();

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
					className="transition-all fixed w-screen h-screen inset-0 z-50 flex justify-center bg-pr-c-green1 bg-opacity-30"
					onClick={isOpen && onClose}
				>
					<motion.div
						key="modal-content"
						initial={{ opacity: 0, y: screen == ScreenType.Desktop ? -10 : +20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: screen == ScreenType.Desktop ? -10 : +20 }}
						transition={transition}
						className="flex md:h-auto h-full w-full md:max-w-3xl md:m-0 justify-center sm-only:items-end"
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						{children}
					</motion.div>
					<XMarkIcon
						onClick={isOpen && onClose}
						className="cursor-pointer absolute top-base right-base w-double h-double z-50 text-neutral-c-500"
					/>
				</motion.div>
			)}
		</AnimatePresence>,
		modalRoot!,
	);
};
