import React, { useState, useEffect } from "react";
import { Body3, BodyHeadline, Button, OrbitingOrbGreen } from "@nation3/ui-components";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import OrbitingOrbGreenUrl from "@nation3/ui-components";

const INoActionsDefaultProps = {};

const NoActions: React.FC = (props) => {
	return (
		<div className="grid grid-cols-1 gap-6">
			<div className="w-full flex-col items-stretch h-full flex justify-between">
				<div className="flex flex-col justify-between">
					{/* <img src={OrbitingOrbGreenUrl}></img> */}
					<OrbitingOrbGreen className="h-[85px] w-[85px] mb-base" />
					<BodyHeadline>No actions</BodyHeadline>
					<Body3 className="text-slate-500 text-sm mb-4">
						There are no actions available for this agreement.
					</Body3>
				</div>
			</div>
		</div>
	);
};

NoActions.defaultProps = INoActionsDefaultProps;

export default NoActions;
