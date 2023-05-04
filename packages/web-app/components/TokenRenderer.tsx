import { IconRenderer } from "@nation3/ui-components";
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
		<div className="flex">
			<div className="flex gap-min2 shadow rounded-base pr-min2 items-center">
				{token?.icon && (
					<>
						<IconRenderer
							size={"xs"}
							backgroundColor={"pr-c-green1"}
							icon={<Image height={20} width={20} alt={token.name} src={token?.icon} />}
						/>
					</>
				)}

				<Body3 className="text-xs">
					{"$"}
					{token?.symbol}
				</Body3>
			</div>
		</div>
	) : (
		<></>
	);
};

TokenRenderer.defaultProps = ITokenRendererDefaultProps;

export default TokenRenderer;
