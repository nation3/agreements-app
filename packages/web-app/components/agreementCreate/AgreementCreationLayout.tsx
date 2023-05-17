import { Headline3 } from "@nation3/ui-components";
import { useState } from "react";

import { useAgreementCreation } from "./context/AgreementCreationContext";

import { useTokenList } from "../../hooks/useTokenList";

import cx from "classnames";
import { ReactNode, useEffect } from "react";

interface Props {
	children: ReactNode;
}

export const AgreementCreationLayout: React.FC<Props> = ({ children }) => {
	const [activeStep, setActiveStep] = useState<number>(0);

	const tokens = useTokenList();
	const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
	const { setToken } = useAgreementCreation();

	useEffect(() => {
		// Set default token
		setToken(tokens[0]);
	}, []);

	const openTokenModal = (state: boolean) => {
		setIsTokenModalOpen(state);
	};

	return (
		<>
			<article
				id="agreementCreation"
				className={cx(
					"grid grid-flow-row grid-cols-1 auto-rows-auto gap-base z-10 mt-40 m-base pb-double",
					"lg:grid-cols-lg lg:gap-24",
					"xl:grid-cols-xl",
				)}
			>
				<div className="col-start-1 col-end-13 flex flex-col w-full text-gray-800">
					<Headline3 className="font-semibold">Create Agreement</Headline3>
				</div>

				{/* INTRO */}
				{children}
			</article>
		</>
	);
};
