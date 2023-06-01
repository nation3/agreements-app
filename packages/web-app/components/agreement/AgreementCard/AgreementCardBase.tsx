import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
	Card,
	ScreenType,
	IllustrationRenderer,
	N3AgreementDone,
	useScreen,
} from "@nation3/ui-components";

const AgreementCardBase = ({ children }: { children: ReactNode }) => {
	const { screen } = useScreen();

	return (
		<motion.div
			className="w-full h-full rounded-lg"
			initial={{ opacity: 0, y: -10, boxShadow: "0px 0px 0 rgba(0, 0, 0, 0.0)" }}
			animate={{
				opacity: 1,
				y: 0,
				boxShadow: `0px ${screen == ScreenType.Desktop ? "2px 6px" : "1px 4px"} rgba(0, 0, 0, 0.1)`,
			}}
			transition={{ duration: 0.15 }}
		>
			<Card
				size="base"
				className="p-[0px] sm:p-min3 md:p-base flex flex-col gap-min3 w-full h-full"
			>
				<IllustrationRenderer customSize={60} icon={<N3AgreementDone />} size="sm" />
				{children}
			</Card>
		</motion.div>
	);
};

export default AgreementCardBase;
