// MarkdownFile.tsx
import { Body3, IconRenderer, ModalNew, N3Document } from "@nation3/ui-components";
import cx from "classnames";
import MarkdownIt from "markdown-it";
import { FC, useState } from "react";
import styles from "./MarkdownFile.module.css";

interface MarkdownFileProps {
	markdownText: string;
	hash: string;
}

const MarkdownFile: FC<MarkdownFileProps> = ({ markdownText, hash }) => {
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
				<div>
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
