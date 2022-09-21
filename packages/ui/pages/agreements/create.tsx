import React, { useState } from "react";
import { Card } from "@nation3/components";
import { useContractWrite } from "wagmi";
import contractInterface from "../../abis/IAgreementFramework.json";
import { ParticipantRow, TextInput } from "../../components/inputs";
import { Button, BackLinkButton } from "../../components/buttons";
import { generateCriteria } from "../../utils/criteria";
import { transformNumber } from "@nation3/utils";

const abi = contractInterface.abi;

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
		onError(error) {
			console.log(error);
		},
	});

	const create = () => {
		const termsHash = `0x${keccak256(terms).toString("hex")}`;
		const criteria = generateCriteria(
			positions.map(({ address, balance }) => ({
				address: address,
				balance: transformNumber(balance, "bignumber"),
			})),
		);
		const metadataURI = "";

		console.log(termsHash, criteria, metadataURI);

		createAgreement?.({
			recklesslySetUnpreparedArgs: [
				{ termsHash: termsHash, criteria: criteria, metadataURI: metadataURI },
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
					<TextInput
						value={terms}
						onChange={(e: any) => {
							setTerms(e.target.value);
						}}
					/>
				</div>
				<div>
					<h2 className="font-display font-medium text-xl">Positions and stakes</h2>
					<div className="flex flex-col gap-2">
						<ParticipantRow positions={positions} index={0} onChange={setPositions} />
						<ParticipantRow positions={positions} index={1} onChange={setPositions} />
					</div>
				</div>
				<div>
					<Button label="Create Agreement" onClick={() => create()} />
				</div>
			</Card>
		</div>
	);
};

export default AgreementCreation;
