// MarkdownFile.tsx
import { Body1, Body3, IconRenderer, ModalNew, N3Document } from "@nation3/ui-components";
import cx from "classnames";
import MarkdownIt from "markdown-it";
import { FC, useState } from "react";
import styles from "./MarkdownFile.module.css";

interface MarkdownFileProps {
	fileName?: string;
	markdownText: string;
	hash: string;
}

const MarkdownFile: FC<MarkdownFileProps> = ({ markdownText, hash, fileName }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const md = new MarkdownIt();
	const markdownContent = md.render(markdownText);

	return (
		<>
			<div
				className="flex items-center gap-min2 cursor-pointer shadow-sm w-auto rounded-base pr-min2 "
				onClick={() => setIsModalOpen(true)}
			>
				<IconRenderer icon={<N3Document />} backgroundColor={"pr-c-green1"} size={"xs"} />
				<Body3 className="text-neutral-c-800">{hash}</Body3>
			</div>
			<ModalNew isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<div className="bg-white rounded-lg p-8 w-full h-screen max-w-full mx-auto md:max-w-2xl shadow-md border-2 border-neutral-c-200">
					<Body1 className="mb-base">{fileName}</Body1>
					<div
						className={cx("prose prose-blue markdown-content markdown-body", styles)}
						dangerouslySetInnerHTML={{ __html: markdownContent }}
					/>
				</div>
			</ModalNew>
		</>
	);
};

export default MarkdownFile;
