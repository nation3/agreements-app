import { IconRenderer, Body3 } from "@nation3/ui-components";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useFindToken } from "../hooks/useTokenList";

type ITokenRendererProps = { tokenSymbol: string };

const ITokenRendererDefaultProps = {};

const TokenRenderer: React.FC<ITokenRendererProps> = (props) => {
	const { tokenSymbol } = props;
	const token = useFindToken(tokenSymbol);
	const [localToken, setlocalToken] = useState<any>(token);

	useEffect(() => {
		setlocalToken(token);
	}, [token]);

	return localToken?.icon ? (
		<div className="flex">
			<div className="flex gap-min2 shadow rounded-base pr-min2 items-center">
				{localToken.icon && (
					<>
						<IconRenderer
							size={"xs"}
							backgroundColor={"pr-c-green1"}
							icon={<Image height={20} width={20} alt={token.name} src={localToken.icon} />}
						/>
					</>
				)}

				<Body3 className="text-xs">
					{"$"}
					{localToken.symbol}
				</Body3>
			</div>
		</div>
	) : (
		<></>
	);
};

TokenRenderer.defaultProps = ITokenRendererDefaultProps;

export default TokenRenderer;
