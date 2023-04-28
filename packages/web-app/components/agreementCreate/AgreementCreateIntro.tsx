import {
	Body1,
	Body3,
	BodyHeadline,
	Button,
	Card,
	IconRenderer,
	N3Agreement,
	N3User,
	N3World,
} from "@nation3/ui-components";
import cx from "classnames";
import React from "react";
import { GradientLink } from "../GradientLink";

type IAgreementCreateIntroProps = {
	setActiveStep: (step: number) => void; // add setActiveStep as a prop
};

const IAgreementCreateIntroDefaultProps = {};

const AgreementCreateIntro: React.FC<IAgreementCreateIntroProps> = ({
	setActiveStep, // destructure setActiveStep from props
}) => {
	return (
		<React.Fragment>
			<>
				<div
					className={cx(
						"grid grid-flow-row grid-cols-1 auto-rows-auto gap-16",
						"lg:grid-cols-lg lg:gap-24",
						"xl:grid-cols-xl",
					)}
				>
					<Card className="md:p-double col-start-1 col-end-13 flex justify-center items-center">
						<div className="max-w-lg flex-col items-center justify-center flex">
							<IconRenderer
								className="mb-base"
								icon={<N3Agreement />}
								backgroundColor="pr-c-green1"
								size="sm"
								rounded
							/>
							<BodyHeadline>New agreement</BodyHeadline>
							<Body3 className="text-center mb-base">
								Nation3 has its own system of law, enforced by its own court and secured by economic
								incentives.
							</Body3>
							<Button label="Create New Agreement" onClick={() => setActiveStep(1)}></Button>
						</div>
					</Card>
					<Card className="col-start-1 col-end-7" size="base">
						<IconRenderer
							className="mb-base"
							icon={<N3World />}
							backgroundColor="pr-c-green1"
							size="sm"
							rounded
						/>
						<Body1>What is an agreement?</Body1>
						<Body3 className="text-neutral-c-600 my-min3">
							Lorem ipsum dolor sit amet consectetur. Cras feugiat tellus lorem nec rhoncus eu.
							Lorem ipsum dolor sit amet consectetur. Cras feugiat tellus lorem nec rhoncus eu.
						</Body3>
						<GradientLink
							href={"https://docs.nation3.org/agreements/what-is-a-nation3-agreement"}
							caption={"Learn more"}
						></GradientLink>
					</Card>
					<Card className="col-start-7 col-end-13" size="base">
						<IconRenderer
							className="mb-base"
							icon={<N3User />}
							backgroundColor="pr-c-green1"
							size="sm"
							rounded
						/>
						<Body1>Quick tips for great agreements</Body1>
						<Body3 className="text-neutral-c-600 my-min3">
							Lorem ipsum dolor sit amet consectetur. Cras feugiat tellus lorem nec rhoncus eu.
							Lorem ipsum dolor sit amet consectetur. Cras feugiat tellus lorem nec rhoncus eu.
						</Body3>
						<GradientLink
							href={"https://docs.nation3.org/agreements/creating-an-agreement"}
							caption={"Learn more"}
						></GradientLink>
					</Card>
				</div>
			</>
		</React.Fragment>
	);
};

AgreementCreateIntro.defaultProps = IAgreementCreateIntroDefaultProps;

export default AgreementCreateIntro;
