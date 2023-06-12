import React, { HTMLAttributes, useState } from "react";
import cx from "classnames";

const ActionContainer: React.FC<HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
	...props
}) => {
	const [isPressed, setIsPressed] = useState(false);

	return (
		<div
			className={cx(
				`flex items-center justify-center w-fit cursor-pointer`,
				`transition-all`,
				isPressed ? `shadow-none` : `shadow-sm hover:shadow-md`,
				className,
			)}
			onMouseDown={() => setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			onTouchStart={() => setIsPressed(true)}
			onTouchEnd={() => setIsPressed(false)}
			{...props}
		>
			{children}
		</div>
	);
};

export default ActionContainer;
