import { LinkedMarkdown } from "@linkedmd/parser";
import fetch from "cross-fetch";
import MarkdownIt from "markdown-it";

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

async function preprocessInput(input: string): Promise<string> {
	const ipfsLinkRegex = /Import\s+ipfs:\/\/\S+/g;
	const matches = input.match(ipfsLinkRegex);

	if (!matches) {
		return input;
	}

	const replacements: { [key: string]: string } = {};

	await Promise.all(
		matches.map(async (match) => {
			const fileURI = match.slice(match.indexOf("ipfs://"));
			const { parser } = await fetchAndParse(fileURI);
			replacements[match] = parser.toHTML();
			console.log("$$$$ => ", replacements[match]);
		}),
	);

	let processedInput = input;
	for (const match in replacements) {
		processedInput = processedInput.replace(match, replacements[match]);
	}

	return processedInput;
}

async function renderMarkdown(input: string, options: MarkdownIt.Options) {
	const md = new MarkdownIt(options);
	const processedInput = await preprocessInput(input);
	return md.render(processedInput);
}

export default renderMarkdown;
