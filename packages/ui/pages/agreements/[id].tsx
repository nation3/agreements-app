import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { ChevronLeftIcon } from "@heroicons/react/outline";
import { Badge, Button, Card, InfoAlert } from "@nation3/components";
import { transformNumber } from "@nation3/utils";
import { useContractRead, useContractWrite, useSigner } from "wagmi";
import { constants } from "ethers";

import { shortenHash } from "../../utils/strings";
import { fetchMetadata } from "../../utils/metadata";
import Table from "../../components/Table";
import contractInterface from "../../abis/IAgreementFramework.json";

const abi = contractInterface.abi;

const statusMessageMap = {
	0: "Not joined",
	1: "Joined",
	2: "Finalized",
};

const statusMessage = (status: number) => {
    return statusMessageMap[status] || "Unknown"
}

export default function AgreementDetailPage() {
	const router = useRouter();
	const { id } = router.query;
	const contractAddress = "0xb47262C22280f361ad47Af0636086463Bd29A109";

	const [agreementParams, setParams] = useState({
		termsHash: constants.HashZero,
		metadataURI: "ifps://",
	});
	const [agreementMetadata, setMetadata] = useState({
		title: "Agreement",
        resolvers: {}
	});
	const [agreementPositions, setPositions] = useState({});

	const { data: params } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "agreementParams",
		args: id,
	});

	const { data: positions } = useContractRead({
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "agreementPositions",
		args: id,
	});

	const loadMetadata = async (metadataURI: string) => {
		const metadata = await fetchMetadata(metadataURI);
		setMetadata({
            ...agreementMetadata,
            title: metadata?.title,
            resolvers: metadata?.criteria.resolvers ?? {},
        });
	};

	useEffect(() => {
		const newParams = {
			termsHash: params?.termsHash ?? agreementParams.termsHash,
			metadataURI: params?.metadataURI ?? agreementParams.metadataURI,
		};
		if (newParams != agreementParams) {
			setParams(newParams);
			if (params?.metadataURI) {
				loadMetadata(params.metadataURI);
			}
		}
	}, [params]);

	useEffect(() => {
		if (positions) {
			const parsedPositions = positions.reduce(
				(result, [party, balance, status]) => ({
					...result,
					[party.toString()]: {
						balance: balance,
						status: status,
					},
				}),
				{},
			);
			setPositions(parsedPositions);
		}
	}, [positions]);

	return (
		<div>
			<div
				className="flex items-center gap-1 py-1 text-n3blue cursor-pointer hover:underline"
				onClick={() => router.push("/agreements")}
			>
				<ChevronLeftIcon className="w-4 h-4" /> Back to your agreements
			</div>
			<Card className="flex flex-col gap-8 max-w-2xl text-gray-800">
				{/* Title and details */}
				<div className="text-gray-700">
					<h1 className="font-display font-medium text-2xl">{agreementMetadata.title}</h1>
					<span>
						ID {shortenHash(id ?? constants.HashZero)} | Terms hash{" "}
						{shortenHash(agreementParams.termsHash ?? constants.HashZero)}
					</span>
				</div>
				{/* Participant table */}
				<Table
					columns={["participant", "stake", "status"]}
					data={Object.entries(agreementPositions).map(([party, data]) => [
						shortenHash(party),
						<b>{transformNumber(data.balance, "number", 5)} $NATION</b>,
						<Badge textColor="yellow-800" bgColor="yellow-100" text={statusMessage(data.status)} />,
					])}
				/>
				{/* Info */}
				<InfoAlert message="If you are one of the parties involved in this agreement, please keep the terms file safe. You will need it to interact with this app." />
				{/* Action buttons */}
				<div className="flex gap-8 justify-between">
					<Button label="Validate terms" />
					<Button label="Join" />
				</div>
			</Card>
		</div>
	);
}
