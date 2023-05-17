import React, { useState, useEffect } from "react";
import { useToken } from "../hooks/useToken";

type ITokenPreviewProps = {
	symbol: string;
};

const ITokenPreviewDefaultProps = {};

const TokenPreview: React.FC<ITokenPreviewProps> = (props) => {
	const { symbol } = props;
	// const token = useToken(symbol);
	// useEffect(() => {}, []);

	return <React.Fragment></React.Fragment>;
};

TokenPreview.defaultProps = ITokenPreviewDefaultProps;

export default TokenPreview;
