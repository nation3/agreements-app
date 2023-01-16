import React from "react";
import { ReactNode } from "react";
import AppHeader from "../Molecules/AppHeader";

export interface ITopBarProps {
	title: string;
	appName: string;
	connectionButton?: ReactNode;
}

const ITopBarDefaultProps = {};

const TopBar: React.FC<ITopBarProps> = (props) => {
	const { title, appName, connectionButton } = props;

	return (
		<React.Fragment>
			<section className="absolute top-0 left-0 flex h-24 w-full items-center justify-between ">
				<div className="">
					<AppHeader title={title} appName={appName} />
				</div>
				{/* Account */}
				<div className="p-4">{connectionButton}</div>
			</section>
		</React.Fragment>
	);
};

TopBar.defaultProps = ITopBarDefaultProps;

export default TopBar;
