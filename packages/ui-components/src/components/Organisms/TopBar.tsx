import React from "react";
import { ReactNode } from "react";
import AppHeader from "../Molecules/AppHeader";
import Link from "next/link";

export interface ITopBarProps {
	title: string;
	appName: string;
	navItems?: ReactNode;
	connectionButton?: ReactNode;
}

const ITopBarDefaultProps = {};

const TopBar: React.FC<ITopBarProps> = (props) => {
	const { title, appName, navItems, connectionButton } = props;

	return (
		<React.Fragment>
			<section className="absolute top-0 left-0 flex h-24 w-full items-center justify-between">
				<Link href="/" className="cursor-pointer basis-1/4">
					<AppHeader title={title} appName={appName} />
				</Link>
				<div className="basis-1/2 flex items-center justify-center">{navItems}</div>
				<div className="flex items-center justify-end gap-5 basis-1/4">
					<div className="p-4">{connectionButton}</div>
				</div>
			</section>
		</React.Fragment>
	);
};

TopBar.defaultProps = ITopBarDefaultProps;

export default TopBar;
