import React, { ReactNode } from "react";
import Link from "next/link";
import {
	IllustrationRenderer,
	IconRenderer,
	Body3,
	N3Agreement,
	N3LogoGreen,
	SmallCardButton,
} from "@nation3/ui-components";
import { ConnectButton } from "../ConnectButton";
import cx from "classnames";

const TopBarGrid = ({ children }: { children: ReactNode }) => (
	<div className="absolute top w-full z-20">
		<div className="w-full flex justify-center">
			<div
				className={cx(
					"flex w-full md:w-auto mx-min2 md:grid grid-flow-row grid-cols-1 auto-rows-auto gap-y-16",
					"lg:grid-cols-lg lg:gap-24",
					"xl:grid-cols-xl",
					"border-2 bg-glass-c-50 border-glass-c-80 backdrop-blur-sm rounded-full p-min2 mt-min3",
				)}
			>
				{children}
			</div>
		</div>
	</div>
);

// TODO: Move to a separate file and make dynamic routing
const DesktopNavigation = () => {
	return (
		<div id="navigation" className="flex items-center justify-center gap-16">
			<IllustrationRenderer customSize={50} icon={<N3LogoGreen />} size={"sm"} />
			<div className="flex bg-pr-c-green1 rounded-base">
				<Link href="/agreements">
					<SmallCardButton>
						<IconRenderer
							className=""
							icon={<N3Agreement />}
							backgroundColor="pr-c-green1"
							size="xs"
							rounded
						/>
						<span className="pr-4">
							<Body3>Agreements</Body3>
						</span>
					</SmallCardButton>
				</Link>
				<div className="hidden md:flex items-center gap-16 px-[16px]">
					<Link href="/agreements">
						<Body3>My Agreements</Body3>
					</Link>
				</div>
			</div>
		</div>
	);
};

// TODO: Mobile navigation
export const TopBar = () => {
	return (
		<TopBarGrid>
			<div className="flex w-full col-start-1 col-end-13 items-center justify-between">
				<DesktopNavigation />
				<ConnectButton />
			</div>
		</TopBarGrid>
	);
};