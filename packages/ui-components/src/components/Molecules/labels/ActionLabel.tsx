import React from "react";

import Label, { LabelProps } from "../../atoms/Label";
import { ActionContainer } from "../../atoms/containers";

const ActionLabel: React.FC<LabelProps> = (props) => {
	return (
		<ActionContainer className="rounded">
			<Label {...props} />
		</ActionContainer>
	);
};

export default ActionLabel;
