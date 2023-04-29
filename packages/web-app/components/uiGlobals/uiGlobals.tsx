import React, { useEffect, useRef } from "react";

type IUiGlobalsProps = {
	children: React.ReactElement;
};

const IUiGlobalsDefaultProps = {};

const UiGlobals: React.FC<IUiGlobalsProps> = (props) => {
	// eslint-disable-next-line no-empty-pattern
	const {} = props;
	const uiRoot = useRef(null);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useEffect(() => {}, []);

	return (
		<div id="ui-root" ref={uiRoot}>
			{props.children}
		</div>
	);
};

UiGlobals.defaultProps = IUiGlobalsDefaultProps;

export default UiGlobals;
