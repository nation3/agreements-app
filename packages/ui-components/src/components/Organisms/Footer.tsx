import React from "react";
import { RightIcon } from "../../icons";
import { GridContainer, Body3, ThemedIconRenderer, Label } from "../../components/atoms";
import Nation3Logo from "../../illustrations/Nation3Logo.svg";

type IFooterProps = {
	menu?: Array<{ name: string; link: string }>;
};

const IFooterDefaultProps = {
	menu: [
		{ name: "Docs", link: "https://docs.nation3.org" },
		{ name: "About Nation3", link: "https://nation3.org" },
		{ name: "Support", link: "https://discord.gg/invite/nation3-690584551239581708" },
	],
};

const Footer: React.FC<IFooterProps> = (props) => {
	const { menu } = props;
	return (
		<footer className="flex w-full justify-center p-4 border-t-2 border-neutral-200">
			<GridContainer>
				<div className="col-span-6 flex justify-start items-center gap-2">
					<Nation3Logo className="w-10 h-10 rounded-full fill-neutral-600" />
					<span className="text-md font-bossa text-neutral-700">NATION3</span>
					<a
						href="https://docs.nation3.org/agreements/agreements-beta"
						target="_blank"
						rel="noreferrer"
					>
						<Label color="neutral-600" border="neutral-500" className="no-wrap">Beta v0.2.0</Label>
					</a>
				</div>
				<div className="col-span-6 flex justify-end items-center gap-4">
					{menu &&
						menu.map((e) => (
							<>
								<a className="flex items-center gap-1 no-wrap" href={e.link} target="_blank" rel="noreferrer">
									<Body3>{e.name}</Body3>
									<ThemedIconRenderer
										icon={RightIcon}
										theme="neutral"	
										size="extra-small"
										rounded={false}
										containerClass="rounded-sm"
									/>
								</a>
							</>
						))}
				</div>
			</GridContainer>
		</footer>
	);
};

Footer.defaultProps = IFooterDefaultProps;

export default Footer;
