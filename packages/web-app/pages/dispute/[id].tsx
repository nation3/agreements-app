import { useRouter } from "next/router";
import { Card, BackLinkButton } from "@nation3/ui-components";

import { DisputeResolutionProvider } from "../../components/dispute/context/DisputeResolutionProvider";
import {
	DisputeDetails,
	DisputeArbitrationActions,
	DisputeActions,
} from "../../components/dispute";
import { useCohort } from "../../hooks/useCohort";
import { useAccount } from "wagmi";
import React, { useMemo } from "react";
import { useConstants } from "../../hooks/useConstants";
import { Agreement, AgreementActions } from "../../components/agreement";
import Image from "next/image";

const DisputePage = () => {
	const router = useRouter();
	const { query } = router;
	const { judges } = useCohort();
	const { address } = useAccount();
	const { frameworkAddress } = useConstants();

	const isArbitrator = useMemo(() => {
		if (!judges || !address) return false;
		return judges.includes(address);
	}, [judges, address]);

	return (
		<DisputeResolutionProvider framework={frameworkAddress} id={String(query.id)}>
			<article className="w-full flex justify-center">
				<div className="absolute top h-[300px] w-full bg-pr-c-green1 z-5">
					<Image src="/illustrations/header1.svg" fill object-fit="cover" alt={""} />
				</div>
				<section id="agreement" className="grid grid-cols-12 gap-base z-10 mt-40">
					<div className="w-full">
						<BackLinkButton
							route={"/disputes"}
							label={"Go back to disputes"}
							onRoute={router.push}
						/>
					</div>
					<div className="col-start-1 col-end-10 flex flex-col w-full text-gray-800">
						<Card className="flex flex-col gap-8 w-full text-gray-800">
							<DisputeDetails />
						</Card>
					</div>
					<div className="p-base w-full bg-white rounded-lg border-2 border-neutral-c-200 col-start-10 col-end-13 flex flex-col justify-center text-gray-800">
						{isArbitrator && <DisputeArbitrationActions />}
					</div>
				</section>
			</article>
		</DisputeResolutionProvider>
	);
};

export default DisputePage;
