import React from "react";
import cx from "classnames";

export interface GridProps {
	id?: string;
	children: React.ReactNode;
}

const Grid = ({ id, children }: GridProps) => (
	<section
		id={id}
		className={cx(
			"flex flex-col w-full md:w-auto md:grid grid-flow-row grid-cols-1 auto-rows-auto gap-y-16",
			"lg:grid-cols-lg lg:gap-24",
			"xl:grid-cols-xl",
			"z-10 mt-40 m-min3",
		)}
	>
		{children}
	</section>
);

export default Grid;
