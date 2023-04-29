import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import React, { MouseEventHandler, ReactChild } from "react";

export interface ModalProps {
	children: ReactChild;
	show?: boolean;
	onClose?: MouseEventHandler<HTMLElement>;
}

export const Modal = (props: ModalProps) => {
	const { children, onClose, show } = props;
	return show ? (
		<AnimatePresence>
			<div
				className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-screen h-screen p-8 overflow-x-hidden overflow-y-auto bg-gray-700 cursor-pointer bg-opacity-40"
				onClick={onClose}
			>
				<motion.div
					initial={{ scale: 0.5, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="relative w-full max-w-lg px-4 py-6 m-auto text-gray-800 bg-white shadow cursor-default rounded-2xl"
					onClick={(e) => e.stopPropagation()}
				>
					<button
						type="button"
						onClick={onClose}
						className="absolute top-6 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-800 rounded-full text-sm p-1.5 ml-auto inline-flex items-center"
					>
						<XMarkIcon className="w-5 h-5" />
						<span className="sr-only">Close modal</span>
					</button>

					{children}
				</motion.div>
			</div>
		</AnimatePresence>
	) : (
		<></>
	);
};
