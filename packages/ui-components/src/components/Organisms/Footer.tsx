import React from "react";
import styled from "styled-components";
import { N3LinkArrow, N3LogoGradient } from "../../icons/index";
import { Body3, IconRenderer } from "../Atoms";
import { Badge } from "../Molecules";

type IFooterProps = {
	menu?: Array<{ name: string; link: string }>;
};

const LogoHolder = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 48px;
	width: 160px;
	svg {
		height: 100%;
		width: 100%;
	}
`;

const IFooterDefaultProps = {
	menu: [
		{ name: "Docs", link: "https://docs.nation3.org" },
		{ name: "About Nation3", link: "https://docs.nation3.org" },
		{ name: "Nation3 DAO", link: "https://docs.nation3.org" },
		{ name: "Support", link: "https://docs.nation3.org" },
	],
};

const Footer: React.FC<IFooterProps> = (props) => {
	const { menu } = props;
	return (
		<footer className="hidden md:flex justify-center p-base border-t-2 border-neutral-c-200">
			<div className="md:grid grid-cols-xl">
				<div className="col-start-1 col-end-7 flex justify-start items-center">
					<LogoHolder>
						<N3LogoGradient />
					</LogoHolder>
					<Badge color="neutral-c-500" label="Beta v0.2.0" />
				</div>
				<div className="col-start-7 col-end-13 flex justify-end items-center gap-base">
					{menu &&
						menu.map((e) => (
							<div key={e.name}>
								<a key={e.name} className="flex items-center" href={e.link}>
									<Body3 className="mr-min2">{e.name}</Body3>
									<IconRenderer
										customSize={16}
										icon={<N3LinkArrow />}
										backgroundColor={"pr-c-blue1"}
										size={"xs"}
									/>
								</a>
							</div>
						))}
				</div>
			</div>
		</footer>
	);
};

Footer.defaultProps = IFooterDefaultProps;

export default Footer;
