import React, { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { Footer } from "@nation3/ui-components"

export interface LayoutProps {
	children: ReactNode;
}

const AppLayout = ({ children }: LayoutProps) => {
	return (
		<>
			<TopBar />
			<div className="min-h-screen w-full">{children}</div>
			<Footer />
		</>
	);
};

export default AppLayout;
