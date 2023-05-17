import { Card } from "@nation3/ui-components";
import { useRouter } from "next/router";

import cx from "classnames";
import Image from "next/image";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { DisputeArbitrationActions, DisputeDetails } from "../../components/dispute";
import { DisputeResolutionProvider } from "../../components/dispute/context/DisputeResolutionProvider";
import { useCohort } from "../../hooks/useCohort";
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
		<DisputeResolutionProvider framework={frameworkAddress} id={String(query.disputeId)}>
			<article className="w-full flex justify-center">
				<div className="absolute top h-[300px] w-full bg-pr-c-green1 z-5">
					<Image src="/illustrations/header1.svg" fill object-fit="cover" alt={""} />
				</div>

				<section
					id="agreement"
					className={cx(
						"grid sm-only:grid-flow-row sm-only:grid-cols-1 sm-only:auto-rows-auto gap-24",
						"md:grid-cols-12 md:gap-24",
						"z-10 mt-40 m-min3",
					)}
				>
					{/* <div className="w-full">
						<BackLinkButton
							route={"/disputes"}
							label={"Go back to disputes"}
							onRoute={router.push}
						/>
					</div> */}

					{/* CORE DISPUTE DATA */}
					<div className={cx("md:col-start-2 md:col-end-11 md:gap-16", "w-full text-gray-800")}>
						<Card className="flex flex-col gap-8 w-full text-gray-800">
							<DisputeDetails />
						</Card>
					</div>

					{/* DISPUTE ACTIONS */}
					<div
						className={cx(
							// "sticky bottom-base",
							"md:col-start-2 md:col-end-11",
						)}
					>
						<div className="w-full flex flex-col bg-white rounded-lg">
							{isArbitrator && <DisputeArbitrationActions />}
						</div>
					</div>
				</section>
			</article>
		</DisputeResolutionProvider>
	);
};

export default DisputePage;
