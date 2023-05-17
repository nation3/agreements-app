import { PositionMap, Token } from "./agreement/context/types";
import { PositionStatusBadge } from "../components";
import { Table, useScreen, ScreenType } from "@nation3/ui-components";
import { utils, BigNumber } from "ethers";
import { AccountDisplay } from "./AccountDisplay";

const PositionsTable = ({
	positions,
	token,
}: {
	positions: PositionMap | undefined;
	token: Token | undefined;
}) => {
	const { screen } = useScreen();

	return (
		<Table
			columns={
				screen === ScreenType.Desktop
					? ["participant", "stake", "status"]
					: ["participant", "stake"]
			}
			data={Object.entries(positions ?? {}).map(([account, { collateral, status }], index) =>
				screen === ScreenType.Desktop
					? [
							<AccountDisplay key={index} address={account} />,
							<b key={index}>
								{" "}
								{utils.formatUnits(BigNumber.from(collateral))} ${token?.symbol ?? ""}
							</b>,
							<PositionStatusBadge key={index} status={status} />,
					  ]
					: [
							<AccountDisplay key={index} address={account} />,
							<b key={index}>
								{" "}
								{utils.formatUnits(BigNumber.from(collateral))} ${token?.symbol ?? ""}
							</b>,
					  ],
			)}
		/>
	);
};

export default PositionsTable;
