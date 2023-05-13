import { IllustrationRenderer, N3LogoGreen } from "@nation3/ui-components";
import cx from "classnames";
import Link from "next/link";
import React, { ReactNode, memo, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useCohort } from "../hooks/useCohort";

export interface ITopBarProps {
	title: string;
	appName: string;
	navItems?: ReactNode;
	connectionButton?: ReactNode;
}

// eslint-disable-next-line react/display-name
const HeaderNavigation = memo(() => {
	const { address } = useAccount();
	const { judges } = useCohort();

	const [isDisputesVisible, setIsDisputesVisible] = useState<boolean>(false);

	useEffect(() => {
		if (!judges || !address) return setIsDisputesVisible(false);
		setIsDisputesVisible(judges.includes(address));
	}, [address, judges, setIsDisputesVisible]);

	return (
		<>
			<Link
				href="/agreements"
				className={`${"text-sm py-min2 px-min3 bg-white shadow rounded-md ml-min3 text-neutral-700"}`}
			>
				Agreements
			</Link>
			{isDisputesVisible && (
				<>
					<Link
						href="/disputes"
						className={`${"text-sm py-min2 px-min3 bg-white shadow rounded-md ml-min3 text-neutral-700"}`}
					>
						Disputes
					</Link>
				</>
			)}
		</>
	);
});

const ITopBarDefaultProps = {};

const TopBar: React.FC<ITopBarProps> = (props) => {
	const { title, appName, navItems, connectionButton } = props;

	return (
		<React.Fragment>
			<div className="absolute top-0 left-0 flex justify-center z-10 w-full h-auto">
				<div
					className={cx(
						"flex mx-min2 md:grid grid-flow-row grid-cols-1 auto-rows-auto gap-16",
						"lg:grid-cols-lg lg:gap-24",
						"xl:grid-cols-xl",
						"border-2 bg-glass-c-50 border-glass-c-80 backdrop-blur-sm rounded-full p-min2 mt-min2",
					)}
				>
					<section className="col-start-1 col-end-13 flex items-center justify-between">
						<div className="w-full flex items-center h-full">
							<Link href="/" className="cursor-pointer">
								<div className="h-[50px] w-[50px]">
									<IllustrationRenderer icon={<N3LogoGreen />} size={"sm"} />
								</div>
							</Link>
							<HeaderNavigation />
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
