import React, { useState } from "react";
import { Card } from "@nation3/components";
import { useContractWrite } from "wagmi";
import contractInterface from "../../abis/IAgreementFramework.json";
import { ParticipantRow, TextAreaInput, DropInput } from "../../components/inputs";
import { Button, BackLinkButton } from "../../components/buttons";
import { generateCriteria } from "../../utils/criteria";
import { Web3Storage } from "web3.storage";
import keccak256 from "keccak256";
import { utils } from "ethers";
import { pack } from "ipfs-car/pack";
import { CarReader } from "@ipld/car";

const abi = contractInterface.abi;
const IPFSToken = process.env.IPFS_API_TOKEN ?? "";

const validate = (positions: { address: string; balance: number }[]): boolean => {
	let isValid = true;
	const addresses: string[] = [];
	positions.map(({ address }) => {
		if (!utils.isAddress(address) || addresses.includes(address)) {
			isValid = false;
		}
		addresses.push(address);
	});
	return isValid;
};

const objectToFile = (obj: object, filename: string) => {
	const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

	return new File([blob], filename);
};

const preparePutToIPFS = async (obj: object) => {
	const client = new Web3Storage({ token: IPFSToken });

	const file = objectToFile(obj, "data.json");
	const { root, out } = await pack({ input: [file], wrapWithDirectory: false });
	const cid = root.toString();

	const put = async () => {
		const car = await CarReader.fromIterable(out);
		return client.putCar(car);
	};

	return { cid, put };
};

const AgreementCreation = () => {
	const contractAddress = "0xb47262C22280f361ad47Af0636086463Bd29A109";
	const [terms, setTerms] = useState("");
	const [positions, setPositions] = useState([
		{ address: "", balance: 0 },
		{ address: "", balance: 0 },
	]);

	const { write: createAgreement } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "createAgreement",
		onSettled(data, error) {
			if (data) {
				uploadMetadataToIPFS();
			} else {
				console.log(error);
			}
		},
	});

	const uploadMetadataToIPFS = async () => {
		const metadata = agreementMetadata();

		const { put } = await preparePutToIPFS(metadata);

		const cid = await put();
		console.log(`metadata uploaded to ${cid}`);
	};

	const agreementMetadata = () => {
		const termsHash = `0x${keccak256(terms ?? "").toString("hex")}`;
		const { criteria, resolvers } = generateCriteria(
			positions.map(({ address, balance }) => ({
				address: address,
				balance: utils.parseUnits(balance.toString(), 18),
			})),
		);

		return { termsHash: termsHash, criteria: criteria, resolvers: resolvers };
	};

	const create = async () => {
		const metadata = agreementMetadata();

		const { cid } = await preparePutToIPFS(metadata);
		const metadataURI = `https://w3s.link/ipfs/${cid}`;

		createAgreement?.({
			recklesslySetUnpreparedArgs: [
				{ termsHash: metadata.termsHash, criteria: metadata.criteria, metadataURI: metadataURI },
			],
		});
	};

	return (
		<div>
			<BackLinkButton route="/agreements" />
			<Card className="flex flex-col items-center items-stretch gap-8 w-screen max-w-3xl text-gray-700">
				<div className="text-gray-800">
					<h1 className="font-display font-medium text-2xl">New Agreement</h1>
				</div>
				<div>
					<h2 className="font-display font-medium text-xl">Agreement Terms</h2>
					<div className="flex flex-col gap-2">
						<DropInput
							dropzoneConfig={{
								accept: { "text/markdown": [".md"] },
								maxFiles: 1,
								onDrop: (acceptedFiles: FileList) => {
									acceptedFiles[0].text().then((text: string) => setTerms(text));
								},
							}}
						/>
						<TextAreaInput
							value={terms}
							onChange={(e: any) => {
								setTerms(e.target.value);
							}}
						/>
					</div>
				</div>
				<div>
					<h2 className="font-display font-medium text-xl">Positions and stakes</h2>
					<div className="flex flex-col gap-2">
						<ParticipantRow positions={positions} index={0} onChange={setPositions} />
						<ParticipantRow positions={positions} index={1} onChange={setPositions} />
					</div>
				</div>
				<Button label="Create Agreement" disabled={!validate(positions)} onClick={() => create()} />
			</Card>
		</div>
	);
};

export default AgreementCreation;
