import React from "react";
import Nation3Logo from "../Atoms/Nation3Logo";

type IAppHeaderProps = {
	title: string;
	appName: string;
};

const IAppHeaderDefaultProps = {};

const AppHeader: React.FC<IAppHeaderProps> = (props) => {
	const { title, appName } = props;

	return (
		<React.Fragment>
			<div className="px-4">
				<div className="w-full flex items-center justify-start gap-2 py-8">
					<div className="w-16">
						<Nation3Logo />
					</div>
					<div className="pl-3">
						<div className="flex items-center justify-start gap-2">
							<h1 className="text-2xl text-slate-800 font-bold">{appName}</h1>
							<span className="bg-greensea text-white text-sm p-0.5 rounded-lg px-2">Beta</span>
						</div>
						<p className="text-xs text-slate-600">{title}</p>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

AppHeader.defaultProps = IAppHeaderDefaultProps;

export default AppHeader;
