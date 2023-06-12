import { Root, Portal, Content } from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from "framer-motion";
import cx from "classnames";

import React, { FC, useCallback, useEffect, useMemo } from "react";
import { useScreen, ScreenType } from "../../../hooks/useScreen";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	isClosingDisabled?: boolean;
	className?: string;
}

export const ModalOverlay: React.FC = () => (
	<motion.div
		key="modal-overlay"
		initial={{ opacity: 0, backdropFilter: "blur(2px)" }}
		animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
		exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
		transition={{ duration: 0.15 }}
		className="fixed w-screen h-screen inset-0 z-30 bg-primary-blue-200 bg-opacity-30 transition-all"
	/>
);

export const ModalContainer: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
	const { screen } = useScreen();
	const contentAnimation = useMemo(() => {
		/* FIXME: If for any reason the screen type changes while the modal is open,
		 *	the animation will displace the modal from the center of the screen */
		if (screen == ScreenType.Mobile) {
			return {
				initial: { opacity: 0, y: "100%" },
				animate: { opacity: 1, y: "0%" },
				exit: { opacity: 0, y: "100%" }
			};
		} else {
			return {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 }
			};
		}
	}, [screen]);

	return (
		<motion.div
			key="modal-container"
			{...contentAnimation}
			transition={{ duration: 0.2 }}
			className={cx(
				"fixed z-50 transition-all",
				screen === ScreenType.Mobile ? "bottom-0 left-0 right-0" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
				"bg-white rounded-t md:rounded",
				className
			)}
		>
			{children}
		</motion.div>
	)
};

export const Modal: FC<ModalProps> = ({
	isOpen,
	onClose,
	children,
	isClosingDisabled = false,
	className
}) => {
	const [rootOpen, setRootOpen] = React.useState(false);

	const handleClose = useCallback(() => {
		if (!isClosingDisabled) onClose();
	}, [isClosingDisabled, onClose]);

	/* Propage open / close state to root */
	/* Adds a delay to the close animation to prevent flickering */
	useEffect(() => {
		if (isOpen === rootOpen) return;

		if (isOpen) {
			setRootOpen(true);
		} else {
			// FIXME: this is a hack to prevent the root to unmount before the exit animation is finished
			setTimeout(() => {
				setRootOpen(false);
			}, 300);
		}
	}, [isOpen, rootOpen]);

	return (
		<Root open={rootOpen}>
			<Portal>
				<AnimatePresence>
					{isOpen && (<>
						<ModalOverlay />
						<Content
							onInteractOutside={() => handleClose()}
							onEscapeKeyDown={() => handleClose()}
						>
							<ModalContainer className={className}>
								{children}
							</ModalContainer>
						</Content>
					</>)}
				</AnimatePresence>
			</Portal>
		</Root>
	)
};