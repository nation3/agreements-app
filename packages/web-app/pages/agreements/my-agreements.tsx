import { Button, Card, Headline3 } from "@nation3/ui-components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import cx from "classnames";
import { GetStaticProps } from "next/types";
import {
	AgreementList,
	AgreementListProvider,
} from "../../components/agreements-list/AgreementList";
import { useConstants } from "../../hooks/useConstants";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale as string, ["common"])),
			// Will be passed to the page component as props
		},
	};
};

const Agreements = () => {
	const router = useRouter();
	const { subgraphURI } = useConstants();

	return (
		<AgreementListProvider>
			<article className="w-full flex justify-center">
				<div className="absolute top h-60 w-full bg-pr-c-green1 z-1"></div>
				<div
					id="agreementsPage"
					className={cx(
						"grid grid-flow-row grid-cols-1 auto-rows-auto gap-16",
						"lg:grid-cols-lg lg:gap-24",
						"xl:grid-cols-xl",
						"z-10 mt-40 m-min3",
					)}
				>
					<div className="flex items-start justify-between text-gray-700 col-start-1 col-end-13 gap-16">
						<Headline3 className="">My Agreements</Headline3>
						<div className="flex">
							<Button label="New Agreement" onClick={() => router.push("/agreements/create")} />
						</div>
					</div>
					{/* <div className="col-start-1 col-end-12 h-40 bg-pr-c-green2"></div> */}
					<Card
						size="base"
						className={cx("col-start-1 col-end-13 gap-16", "flex flex-col w-full text-gray-800")}
					>
						<AgreementList />
					</Card>
				</div>
			</article>
		</AgreementListProvider>
	);
};

export default Agreements;
