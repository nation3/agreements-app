import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Badge, Card, InfoAlert } from "@nation3/components";
import { transformNumber, NumberType } from "@nation3/utils";
import { useContractRead, useContractWrite, useSigner } from "wagmi";
import { constants } from "ethers";

import { shortenHash } from "../../utils/strings";
import { fetchMetadata, AgreementMetadata, parseMetadata } from "../../utils/metadata";
import Table from "../../components/Table";
import { Button, UploadButton } from "../../components/buttons";
import contractInterface from "../../abis/IAgreementFramework.json";

const abi = contractInterface.abi;

const statusMessageMap: { [key: number]: string } = {
	0: "Not joined",
	1: "Joined",
	2: "Finalized",
};

const statusMessage = (status: number) => {
	return statusMessageMap[status] || "Unknown";
};

export default function AgreementDetailPage() {
	const router = useRouter();
	const { id } = router.query;
	const { data: signer } = useSigner();
	const contractAddress = "0xb47262C22280f361ad47Af0636086463Bd29A109";
	const [joinable, setJoinable] = useState(false);

	const [title, setTitle] = useState("Agreement");
	const [termsHash, setTermsHash] = useState<string>();
	const [metadataURI, setMetadataURI] = useState<string>();
	const [resolvers, setResolvers] = useState<{
		[key: string]: { balance: string; proof: string[] };
	}>();
	const [positions, setPositions] = useState<{
		[key: string]: { balance: string; status: number };
	}>();

	const { data: agreementParams } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "agreementParams",
		args: id,
	});

	const { data: agreementPositions } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "agreementPositions",
		args: id,
	});

	const { write: joinAgreement } = useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "joinAgreement",
		onError(error) {
			console.log(error);
		},
	});

	const setMetadata = (metadata: AgreementMetadata) => {
		if (metadata.title) {
			setTitle(metadata.title);
		}
		if (metadata.criteria?.resolvers) {
			const parsed: { [key: string]: { balance: string; proof: string[] } } = Object.entries(
				metadata.criteria.resolvers,
			).reduce(
				(result, [account, { amount, proof }]) => ({
					...result,
					[account]: { balance: amount, proof: proof },
				}),
				{},
			);
			setResolvers({ ...resolvers, ...parsed });
		}
	};

	const join = async () => {
		const address: string | undefined = await signer?.getAddress();
		if (!address) {
			return false;
		}

		const resolver = { account: address, ...resolvers?.[address] };
		if (!resolver.proof) {
			return false;
		}

		console.log("Resolver", resolver);

		joinAgreement?.({
			recklesslySetUnpreparedArgs: [id, resolver],
		});
	};

	/* Update state when fetched agreement params */
	useEffect(() => {
		if (agreementParams?.termsHash && agreementParams.termsHash != termsHash) {
			setTermsHash(agreementParams.termsHash);
		}
		if (agreementParams?.metadataURI && agreementParams.metadataURI != metadataURI) {
			setMetadataURI(agreementParams.metadataURI);
			fetchMetadata(agreementParams.metadataURI).then((metadata) => setMetadata(metadata));
		}
	}, [agreementParams]);

	/* Update positions when fetched agreement positions or new resolvers */
	useEffect(() => {
		let knownPositions: { [key: string]: { balance: string; status: number } } = {};
		if (resolvers) {
			knownPositions = Object.entries(resolvers).reduce(
				(result, [account, { balance }]) => ({
					...result,
					[account.toString()]: {
						balance: balance,
						status: 0,
					},
				}),
				knownPositions,
			);
		}
		if (agreementPositions) {
			knownPositions = agreementPositions.reduce(
				(result, [party, balance, status]) => ({
					...result,
					[party.toString()]: {
						balance: balance,
						status: status,
					},
				}),
				knownPositions,
			);
		}
		if (knownPositions != positions) {
			setPositions(knownPositions);
			signer?.getAddress().then((address) => {
				if (address && knownPositions[address] && knownPositions[address].status == 0) {
					setJoinable(true);
				}
			});
		}
	}, [agreementPositions, resolvers]);

	return (
		<div>
			<div
				className="flex items-center gap-1 py-1 text-n3blue cursor-pointer hover:underline"
				onClick={() => router.push("/agreements")}
			>
				<ChevronLeftIcon className="w-5 h-5" /> Back to your agreements
			</div>
			<Card className="flex flex-col gap-8 max-w-2xl text-gray-800">
				{/* Title and details */}
				<div className="text-gray-700">
					<h1 className="font-display font-medium text-2xl">{title}</h1>
					<span>
						ID {shortenHash(String(id) ?? constants.HashZero)} | Terms hash{" "}
						{shortenHash(termsHash ?? constants.HashZero)}
					</span>
				</div>
				{/* Participant table */}
				<Table
					columns={["participant", "stake", "status"]}
					data={Object.entries(positions ?? {}).map(([account, { balance, status }]) => [
						shortenHash(account),
						<b> {String(transformNumber(balance, NumberType.number, 5))} $NATION</b>,
						<Badge textColor="yellow-800" bgColor="yellow-100" text={statusMessage(status)} />,
					])}
				/>
				{/* Info */}
				<InfoAlert message="If you are one of the parties involved in this agreement, please keep the terms file safe. You will need it to interact with this app." />
				{/* Action buttons */}
				<div className="flex gap-8 justify-between">
					<UploadButton
						label="Upload metadata"
						onUpload={(data) => setMetadata(parseMetadata(data))}
					/>
					<Button label="Join" disabled={!joinable} onClick={() => join()} />
				</div>
			</Card>
		</div>
	);
}
