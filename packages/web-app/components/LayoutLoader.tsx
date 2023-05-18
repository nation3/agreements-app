import { BottonNav, Footer, ScreenType, useScreen } from "@nation3/ui-components";
import cx from "classnames";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { ConnectButton } from "./ConnectButton";
import TopBar from "./TopBar";

interface AgreementsLayoutProps {
	children: ReactNode;
}

const AgreementsLayout: React.FC<AgreementsLayoutProps> = ({ children }) => {
	const router = useRouter();
	const { screen } = useScreen();

	/* TODO: AT GROWING THE APP BUILD DYNAMIC DATA STRUCTURES BASED ON LOCATION */
	const appName = {
		name: "Agreements",
		link: "/agreements",
	};

	const navElements = [
		{
			name: "My agreements",
			link: appName.link + "/myagreements",
		},
		{
			name: "Create",
			link: appName.link + "/create",
		},
	];

	return (
		<>
			{/* 			<Head>
				<title>Nation3 Agreements</title>
				<link rel="icon" href="/favicon.ico" />
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
					rel="stylesheet"
				/>
			</Head> */}

			<div className="mx-auto">
				<div className="relative">
					{/* NAVBAR */}
					{screen === ScreenType.Desktop ? (
						<TopBar
							navElements={navElements}
							appName={appName}
							connectionButton={<ConnectButton />}
						/>
					) : (
						<BottonNav connectionButton={<ConnectButton />} />
					)}

					{/* CONTENT */}
					<div className={cx("min-h-screen w-full")}>{children}</div>

					{/* FOOTER */}
					<Footer />
				</div>
			</div>
		</>
	);
};

interface LayoutLoaderProps {
	children: ReactNode;
}

const LayoutLoader: React.FC<LayoutLoaderProps> = ({ children }) => {
	/* FUTURE LOGIC HERE */
	return <AgreementsLayout>{children}</AgreementsLayout>;
};

export default LayoutLoader;
