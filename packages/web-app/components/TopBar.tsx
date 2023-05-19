import {
	Body3,
	IconRenderer,
	IllustrationRenderer,
	N3Agreement,
	N3LogoGreen,
	N3UpRightArrowIcon,
	TextCard,
} from "@nation3/ui-components";
import cx from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

export interface ITopBarProps {
	appName: { name: string; link: string };
	navElements?: { name: string; link: string }[];
	connectionButton?: ReactNode;
	isArbitrator?: boolean;
}

const ITopBarDefaultProps = {};

const TopBar: React.FC<ITopBarProps> = (props) => {
	const { appName, navElements, connectionButton, isArbitrator } = props;
	const router = useRouter();

	return (
		<React.Fragment>
			<div className="absolute top-0 left-0 flex justify-center z-20 w-full">
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

							{/* TODO: FUTURE COMPONETISE BASED ON OTHER APPS & navElements  */}
							<div className="flex gap-min3 bg-pr-c-green1 items-center rounded-base pr-base h-[32px]">
								{/* FUTURE DROPDOWNCARD */}
								<Link
									href={appName.link}
									className={"flex items-center gap-min2 bg-white shadow rounded-base h-[32px]"}
								>
									<TextCard
										icon={
											<IconRenderer
												icon={<N3Agreement />}
												size="xs"
												backgroundColor="pr-c-green1"
											/>
										}
										text={appName.name}
									/>
								</Link>

								<div className="flex gap-min3 items-center">
									{navElements &&
										navElements.map((el, i) => {
											return (
												<Link
													key={i}
													href={el.link}
													className={"text-sm rounded-base text-neutral-700"}
												>
													<Body3
														color={
															router.asPath === el.link
																? "text-neutral-c-800"
																: "text-neutral-c-400"
														}
														className={cx("text-xs transition-colors font-medium")}
													>
														{el.name}
													</Body3>
												</Link>
											);
										})}
								</div>
							</div>
						</div>

						{/* FEEDBACK */}
						<div className="flex items-center justify-end gap-min3">
							<Link
								href="https://airtable.com/shrGlDQrBEcoKcI1B"
								target="_blank"
								className="cursor-pointer"
							>
								<TextCard
									className="pr-min2"
									iconRight
									shadow
									icon={
										<IconRenderer
											icon={<N3UpRightArrowIcon />}
											customSize={13}
											backgroundColor="pr-c-green1"
										/>
									}
									text={"Give feedback"}
								/>
							</Link>
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
