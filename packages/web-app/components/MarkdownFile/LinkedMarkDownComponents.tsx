import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import tippy, { inlinePositioning } from "tippy.js";
import "tippy.js/dist/tippy.css";
import { LinkedMarkdown } from "./LinkedMardownParser";

const IPFS_GATEWAY = "https://cf-ipfs.com/ipfs";

const fetchAndParse = async (fileURI: string) => {
	const ipfsURI = fileURI.startsWith("ipfs://")
		? `${IPFS_GATEWAY}/${fileURI.split("ipfs://")[1]}`
		: false;
	const data = await fetch(ipfsURI ? ipfsURI : fileURI);
	const file = await data.text();
	const parser = new LinkedMarkdown(file);
	await parser.parse();
	return { file, parser };
};

const loadTooltips = () => {
	tippy("abbr[title]", {
		content: (ref) => ref.getAttribute("title") as string,
		placement: "bottom",
		inlinePositioning: true,
		plugins: [inlinePositioning],
	});
};

interface LinkedMarkdownLocalViewerProps {
	file: string;
	onFileChange?: FileURICallback;
}

export const LinkedMarkdownLocalViewer = ({
	file,
	onFileChange,
}: LinkedMarkdownLocalViewerProps) => {
	const [fileStack, setFileStack] = useState<string[]>([]);
	const [output, setOutput] = useState("");
	const [loading, setLoading] = useState(false);

	const openDefinitionsCollapsible = () => {
		const hash = location.hash.substring(1);
		if (hash) {
			const target = document.getElementById(hash);
			if (target) {
				const details = target.closest("details");
				if (details) details.open = true;
			}
		}
	};
	window.addEventListener("hashchange", openDefinitionsCollapsible);

	const fetchAndSet = async (newFileURI: string, addToStack?: boolean) => {
		setLoading(true);
		const parser = new LinkedMarkdown(file);
		await parser.parse();
		setOutput(parser.toHTML() || "");
		addToStack && setFileStack((fileStack) => [...fileStack, newFileURI]);
		onFileChange && onFileChange(newFileURI);
		setLoading(false);
		setTimeout(loadTooltips, 500);
		openDefinitionsCollapsible();
	};

	useEffect(() => {
		fetchAndSet(file);
	}, []);

	useEffect(() => {
		fetchAndSet(file);
	}, [file]);

	async function goBack() {
		await fetchAndSet(fileStack[fileStack.length - 2], false);
		setFileStack(fileStack.slice(0, -1));
	}

	return (
		<div>
			{fileStack.length > 1 && (
				<a onClick={goBack} style={{ cursor: "pointer" }}>
					← Back
				</a>
			)}
			{loading && fileStack.length > 1 && " | "}
			{loading && <span>Loading</span>}

			<div className="LM-output" dangerouslySetInnerHTML={{ __html: output }} />
		</div>
	);
};

type FileURICallback = (newFileURI: string) => any;

interface Props {
	fileURI: string;
	onFileURIChange?: FileURICallback;
}

export const LinkedMarkdownViewer = ({ fileURI, onFileURIChange }: Props) => {
	const [fileStack, setFileStack] = useState<string[]>([]);
	const [output, setOutput] = useState("");
	const [loading, setLoading] = useState(false);

	const openDefinitionsCollapsible = () => {
		const hash = location.hash.substring(1);
		if (hash) {
			const target = document.getElementById(hash);
			if (target) {
				const details = target.closest("details");
				if (details) details.open = true;
			}
		}
	};
	window.addEventListener("hashchange", openDefinitionsCollapsible);

	const fetchAndSet = async (newFileURI: string, addToStack?: boolean) => {
		setLoading(true);
		const { parser } = await fetchAndParse(newFileURI);
		setOutput(parser.toHTML() || "");
		addToStack && setFileStack((fileStack) => [...fileStack, newFileURI]);
		onFileURIChange && onFileURIChange(newFileURI);
		setLoading(false);
		setTimeout(loadTooltips, 500);
		openDefinitionsCollapsible();
	};

	useEffect(() => {
		fetchAndSet(fileURI);
	}, []);

	useEffect(() => {
		fetchAndSet(fileURI);
	}, [fileURI]);

	async function goBack() {
		await fetchAndSet(fileStack[fileStack.length - 2], false);
		setFileStack(fileStack.slice(0, -1));
	}

	return (
		<div>
			{fileStack.length > 1 && (
				<a onClick={goBack} style={{ cursor: "pointer" }}>
					← Back
				</a>
			)}
			{loading && fileStack.length > 1 && " | "}
			{loading && <span>Loading</span>}

			<div className="LM-output" dangerouslySetInnerHTML={{ __html: output }} />
		</div>
	);
};

export const LinkedMarkdownEditor = ({ fileURI }: Props) => {
	const [input, setInput] = useState<string>("");
	const [output, setOutput] = useState("");

	const fetchAndSet = (newFileURI: string) => {
		fetchAndParse(newFileURI).then(({ file, parser }: { file: string; parser: any }) => {
			setInput(file || "");
			setOutput(parser.toHTML() || "");
			!!file && localStorage.setItem("saved-input", file);
		});
	};

	useEffect(() => {
		fetchAndSet(fileURI);
	}, [fileURI]);

	useEffect(() => {
		const parser = new LinkedMarkdown(input);
		parser.parse().then(() => {
			setOutput(parser.toHTML());
			setTimeout(loadTooltips, 500);
		});
		input !== "" && localStorage.setItem("saved-input", input);
	}, [input]);

	useEffect(() => {
		fetchAndSet(fileURI);
		const savedInput = localStorage.getItem("saved-input");
		!!savedInput && setInput(savedInput || "");
	}, []);

	const handleInput = (e: React.SyntheticEvent) => {
		const target = e.target as typeof e.target & {
			value: string;
		};

		setInput(target.value);
	};

	return (
		<div className="LM-split-screen">
			<TextareaAutosize className="LM-input" onChange={handleInput} value={input} autoFocus />
			<div className="LM-output" dangerouslySetInnerHTML={{ __html: output }} />
		</div>
	);
};
