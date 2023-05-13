import {
	Body3,
	IconRenderer,
	IllustrationRenderer,
	N3Agreement,
	N3LogoGreen,
} from "@nation3/ui-components";
import cx from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
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
	const router = useRouter();

	const [isDisputesVisible, setIsDisputesVisible] = useState<boolean>(false);

	useEffect(() => {
		if (!judges || !address) return setIsDisputesVisible(false);
		setIsDisputesVisible(judges.includes(address));
	}, [address, judges, setIsDisputesVisible]);

	return (
		<div className="flex gap-min3 bg-pr-c-green1 items-center rounded-base pr-base h-[32px]">
			<Link
				href="/agreements"
				className={"flex items-center gap-min2 bg-white shadow rounded-base h-[32px] pr-min2"}
			>
				<IconRenderer icon={<N3Agreement />} customSize={32} backgroundColor="pr-c-green1" />
				<Body3 className="text-xs">Agreements</Body3>
			</Link>

			<div className="flex gap-min3 items-center">
				<Link
					href="/agreements"
					className={"text-sm rounded-base text-neutral-700"}
					onClick={(e) => {
						if (router.pathname === "/agreements/dashboard") {
							e.preventDefault();
						}
					}}
				>
					<Body3
						color={
							router.pathname === "/agreements/dashboard"
								? "text-neutral-c-800"
								: "text-neutral-c-400"
						}
						className={cx("text-xs transition-colors font-medium")}
					>
						Dashboard
					</Body3>
				</Link>
				<Link
					href="/agreements"
					className={"text-sm rounded-base text-neutral-700"}
					onClick={(e) => {
						if (router.pathname === "/agreements") {
							e.preventDefault();
						}
					}}
				>
					<Body3
						color={router.pathname === "/agreements" ? "text-neutral-c-800" : "text-neutral-c-400"}
						className={cx("text-xs transition-colors font-medium")}
					>
						Agreements
					</Body3>
				</Link>
				<Link href="/agreement/create" className={"text-sm   rounded-base text-neutral-700"}>
					<Body3
						color={
							router.pathname === "/agreement/create" ? "text-neutral-c-800" : "text-neutral-c-400"
						}
						className={cx("text-xs transition-colors font-medium")}
					>
						Create
					</Body3>
				</Link>
			</div>
			{/* {isDisputesVisible && (
				<>
					<Link href="/disputes" className={" bg-white shadow-md rounded-base text-neutral-700"}>
						<Body3>Disputes</Body3>
					</Link>
				</>
			)} */}
		</div>
	);
});

const ITopBarDefaultProps = {};

const TopBar: React.FC<ITopBarProps> = (props) => {
	const { title, appName, navItems, connectionButton } = props;

	return (
		<React.Fragment>
			<div className="absolute top-0 left-0 flex justify-center z-10 w-full">
				<div
					className={cx(
						"flex mx-min2 md:grid grid-flow-row grid-cols-1 auto-rows-auto gap-16",
						"lg:grid-cols-lg lg:gap-24",
						"xl:grid-cols-xl",
						"border-2 bg-glass-c-50 border-glass-c-80 backdrop-blur-sm rounded-full p-min2 mt-min3",
					)}
				>
					<section className="col-start-1 col-end-13 flex items-center justify-between">
						<div className="w-full flex gap-base items-center">
							<Link href="/" className="cursor-pointer">
								<IllustrationRenderer customSize={50} icon={<N3LogoGreen />} size={"sm"} />
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
