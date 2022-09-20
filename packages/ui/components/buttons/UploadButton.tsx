import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { useState } from "react";
import { UploadModal } from "../modals";

const UploadButton = ({ label, onUpload }: { label: string; onUpload: (data: object) => void }) => {
	const baseClass =
		"flex items-center justify-center w-full p-2 py-3 text-base font-medium transition rounded-lg font-primary gap-1";
	const bgClass = "bg-n3blue hover:bg-n3blue-500 text-white";

	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<motion.button
				type="button"
				whileTap={{ scale: 0.95 }}
				className={`${baseClass} ${bgClass}`}
				onClick={() => setModalOpen(true)}
			>
				<ArrowUpTrayIcon className="w-5 h-5" />
				{label}
			</motion.button>
			{modalOpen && (
				<UploadModal
					title={label}
					onUpload={(data) => {
						onUpload(data);
						setModalOpen(false);
					}}
					onClose={() => setModalOpen(false)}
				/>
			)}
		</>
	);
};

export default UploadButton;
