import { useState } from "react";
import { Button } from "@nation3/ui-components";

import { useDispute } from "./context/DisputeResolutionContext";
import { ResolutionDetails } from "./ResolutionDetails";
import { ResolutionForm } from "./ResolutionForm";
import { useResolutionAppeal } from "../../hooks/useArbitrator";
import { AgreementDisputedAlert } from "../alerts";

export const DisputeArbitrationActions = () => {
	const [mode, setMode] = useState("view");
	const { resolution } = useDispute();

	if (mode == "edit") {
		return <ResolutionForm />;
	} else if (resolution == undefined) {
		return <Button label="Submit a resolution" onClick={() => setMode("edit")} />;
	} else {
		return <Button label="Submit a new resolution" onClick={() => setMode("edit")} />;
	}
};

export const DisputeActions = () => {
	const { resolution } = useDispute();
	const { appeal } = useResolutionAppeal();

	if (resolution) {
		return (
			<div className="flex flex-col gap-2">
				<div>
					<div className="bg-gray-100 rounded-xl">
						<div className="flex flex-col py-2 px-4 text-base font-normal text-gray-700">
							<span>This dispute has been arbitrated by the court.</span>
						</div>
						<div className="flex flex-col gap-2 p-4 pb-2 border-4 border-gray-100 rounded-xl bg-white">
							<ResolutionDetails />

							{resolution.status == "Submitted" && (
								<Button
									label="Appeal"
									onClick={() =>
										appeal({ id: resolution.id, settlement: resolution.settlement || [] })
									}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<>
				<AgreementDisputedAlert />
				<Button label="Send evidence" disabled={true} bgColor="gray" />
			</>
		);
	}
};
