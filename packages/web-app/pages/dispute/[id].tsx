import { useRouter } from "next/router";
import { Card, BackLinkButton } from "@nation3/ui-components";

import { DisputeResolutionProvider } from "../../components/dispute/context/DisputeResolutionProvider";
import { DisputeDetails, DisputeArbitrationActions } from "../../components/dispute";
import { useCohort } from "../../hooks/useCohort";
import { useAccount } from "wagmi";
import React, { useMemo } from "react";
import { useConstants } from "../../hooks/useConstants";

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
		<div className="w-full max-w-3xl">
			<DisputeResolutionProvider framework={frameworkAddress} id={String(query.id)}>
				<BackLinkButton route={"/disputes"} label={"Go back to disputes"} onRoute={router.push} />
				<Card className="flex flex-col gap-8 w-full text-gray-800">
					<DisputeDetails />
					{isArbitrator && <DisputeArbitrationActions />}
				</Card>
			</DisputeResolutionProvider>
		</div>
	);
};

export default DisputePage;
