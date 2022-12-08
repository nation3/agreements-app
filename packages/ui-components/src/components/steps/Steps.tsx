import React, { ReactNode } from "react";
import { Tooltip } from "flowbite-react";
import "flowbite";

const Badge = ({ active, children }: { active: boolean; children: ReactNode }) => (
	<span
		className={`text-sm text-center w-6 h-6 block rounded-full flex items-center justify-center cursor-help ${
			active ? "border border-bluesky-200" : "border border-gray-200"
		} text-bluesky`}
	>
		{children}
	</span>
);

type Step = {
	name: string;
	active: boolean | false;
	tooltipText?: string;
	link?: string;
};

export const Steps = ({ steps }: { steps: Step[] }) => {
	return (
		<React.Fragment>
			<div className="space-y-6">
				<div className="grid grid-flow-col auto-cols-fr justify-items-center max-w-xs m-auto relative">
					{steps.map(({ name, active, tooltipText, link }, i) => {
						return (
							<React.Fragment key={i}>
								<a
									className="flex flex-col items-center text-center dark:text-white"
									href={link}
									target="_blank"
									rel="noreferrer noopener"
								>
									<Tooltip
										content={`${tooltipText}${link ? ". Click to learn more." : ""}`}
										style="light"
									>
										<Badge active={active}>{i}</Badge>
									</Tooltip>
									{name}
								</a>
								{i !== steps.length - 1 && <div className="mt-3 h-0.5 w-full bg-bluesky-100"></div>}
							</React.Fragment>
						);
					})}
				</div>
			</div>
		</React.Fragment>
	);
};
