import Image from "next/image";
import React from "react";
import { Body3 } from "../../ui-components/src/components/Atoms";
import { findToken } from "../hooks/useTokenList";

type ITokenRendererProps = { tokenSymbol: string };

const ITokenRendererDefaultProps = {};

const TokenRenderer: React.FC<ITokenRendererProps> = (props) => {
	const { tokenSymbol } = props;
	const token = findToken(tokenSymbol);
	return token?.symbol ? (
		<React.Fragment>
			<div className="flex gap-min2 items-center">
				{token?.icon && <Image height={20} width={20} alt={token.name} src={token.icon} />}
				<Body3>
					{"$"}
					{token?.symbol}
				</Body3>
			</div>
		</React.Fragment>
	) : (
		<></>
	);
};

TokenRenderer.defaultProps = ITokenRendererDefaultProps;

export default TokenRenderer;
