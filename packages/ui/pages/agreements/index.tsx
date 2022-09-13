import React from "react";
import { Card } from "@nation3/components";
import { shortenHash } from "../../utils/strings";
import { useRouter } from "next/router";

export default function Agreements() {
	const router = useRouter();
	const agreementId = "0x72bbcec4f7f854643fcca20980eb1d48caf12d302899ccc41d78391d9d93b373";
	return (
		<div>
			<Card className="flex flex-col items-center gap-8 w-screen max-w-3xl text-gray-800">
				<div className="text-gray-700">
					<h1 className="font-display font-medium text-2xl">Your Agreements</h1>
				</div>
				<div className="flex-row w-max">
					<div onClick={() => router.push(`/agreements/${agreementId}`)}>
						{shortenHash(agreementId)}
					</div>
				</div>
			</Card>
		</div>
	);
}
