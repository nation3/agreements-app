import React from "react";

import IconLabel, { IconLabelProps } from "./IconLabel";
import { ActionContainer } from "../../atoms/containers";

const ActionIconLabel: React.FC<IconLabelProps> = (props) => {
	return (
		<ActionContainer className="rounded">
			<IconLabel {...props} />
		</ActionContainer>
	);
};

export default ActionIconLabel;
