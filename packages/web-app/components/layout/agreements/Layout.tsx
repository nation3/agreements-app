import React, { ReactNode } from "react";
import Image from "next/image";
import { LayoutProps } from "../Layout";

const AgreementsLayout = ({ children }: LayoutProps) => {
	return (
		<div className="w-full flex justify-center">
			<div className="absolute top h-[300px] w-full bg-pr-c-green1 z-5">
				<Image src="/illustrations/header1.svg" fill object-fit="cover" alt={""} />
			</div>
			{children}
		</div>
	);
};

export default AgreementsLayout;
