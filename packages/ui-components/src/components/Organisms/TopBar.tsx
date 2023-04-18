import React from "react";
import { ReactNode } from "react";
import AppHeader from "../Molecules/AppHeader";
import Link from "next/link";
import Nation3Logo from "../Atoms/Nation3Logo";

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
			<div className="absolute top-0 left-0 flex justify-center z-10 w-full h-auto">
				<div className="grid grid-cols-12 gap-base border-2 bg-glass-c-50 border-glass-c-80 backdrop-blur-sm rounded-full p-min2 mt-min2">
					<section className="col-start-1 col-end-13 flex items-center justify-between">
						<div className="w-full flex items-center h-full">
							<Link href="/" className="cursor-pointer">
								<div className="h-[50px] w-[50px]">
									<Nation3Logo />
								</div>
							</Link>
							<div className="">{navItems}</div>
						</div>
						{/* <div className="basis-1/2 flex items-center justify-center">{navItems}</div> */}
						<div className="flex items-center justify-end gap-5">
							<div className="">{connectionButton}</div>
						</div>
					</section>
				</div>
			</div>
		</React.Fragment>
	);
};

TopBar.defaultProps = ITopBarDefaultProps;

export default TopBar;
