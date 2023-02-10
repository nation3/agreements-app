import React, { useState, useEffect } from "react";
import { useProvider, useNetwork } from "wagmi";

type IUiGlobalsProps = {
	children: React.ReactElement;
};

const IUiGlobalsDefaultProps = {};

const UiGlobals: React.FC<IUiGlobalsProps> = (props) => {
	// eslint-disable-next-line no-empty-pattern
	const {} = props;

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useEffect(() => {}, []);

	return <React.Fragment>{props.children}</React.Fragment>;
};

UiGlobals.defaultProps = IUiGlobalsDefaultProps;

export default UiGlobals;
