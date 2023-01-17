import { useRouter } from "next/router";
import { Card, BackLinkButton } from "@nation3/ui-components";

import { DisputeResolutionProvider } from "../../components/dispute/context/DisputeResolutionProvider";
import { frameworkAddress } from "../../lib/constants";
import { DisputeDetails, DisputeArbitrationActions } from "../../components/dispute";

const DisputePage = () => {
	const router = useRouter();
	const { query } = router;

	return (
		<div className="w-full max-w-3xl">
			<DisputeResolutionProvider framework={frameworkAddress} id={String(query.id)}>
				<BackLinkButton route={"/disputes"} label={"Go back to disputes"} onRoute={router.push} />
				<Card className="flex flex-col gap-8 w-full text-gray-800">
					<DisputeDetails />
					<DisputeArbitrationActions />
				</Card>
			</DisputeResolutionProvider>
		</div>
	);
};

export default DisputePage;
