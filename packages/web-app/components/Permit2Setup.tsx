import cx from "classnames";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { ButtonBase } from "@nation3/ui-components";
import { useTranslation } from "next-i18next";
import { GradientLink } from "./GradientLink";

interface TokenApproval {
	address: string;
	name: string;
	isApproved: boolean;
	approve: () => unknown;
}

export const Permit2Setup = ({ tokens }: { tokens: TokenApproval[] }) => {
	const { t } = useTranslation("common");

	return (
		<section className="max-w-3xl w-full py-18 p-8 flex flex-col items-center justify-center gap-5 text-slate-800">
			<div className="flex flex-col md:w-3/4 gap-1 text-center items-center">
				<div className="text-slate-600 text-lg font-semibold mb-2">{t("permit2.title")}</div>
				<div>{t("permit2.description.p2")}</div>
				<div>{t("permit2.description.p3")}</div>
				<GradientLink
					href="https://uniswap.org/blog/permit2-and-universal-router"
					caption="Learn more"
				/>
			</div>
			{tokens.map((token, index) => (
				<div key={`token-${index}`} className="w-1/2 max-w-xl">
					<ButtonBase
						className={cx(
							"p-2 gap-1 border-2 font-semibold",
							!token.isApproved && "border-bluesky text-bluesky",
						)}
						disabled={token.isApproved}
						onClick={() => token.approve()}
					>
						{token.isApproved ? (
							<>
								<CheckCircleIcon className="w-5 h-5 text-greensea" />
								{token.name} approved
							</>
						) : (
							<>Approve {token.name}</>
						)}
					</ButtonBase>
				</div>
			))}
		</section>
	);
};
