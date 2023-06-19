import React, { HTMLAttributes } from "react";
import cx from "classnames";

import { ActionContainer } from "../../atoms/containers";
import { ThemedIconRenderer, ThemedIconRendererProps } from "../../atoms";

export interface HandlerProps extends HTMLAttributes<HTMLDivElement> {
	primaryIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
	actionIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
	theme?: ThemedIconRendererProps["theme"];
	disabled?: boolean;
}

const Handler: React.FC<HandlerProps> = ({
	primaryIcon: PrimaryIcon,
	actionIcon: ActionIcon,
	theme = "neutral",
	disabled = false,
	className,
	children,
	...props
}) => {
	return (
		<ActionContainer className="rounded">
			<div
				className={cx(
					"flex items-center justify-center w-fit flex-nowrap overflow-hidden rounded transition-all p-1 pr-2",
					"text-sm text-neutral-800",
					"bg-neutral-100",
					"gap-1",
					className,
				)}
				{...props}
			>
				{PrimaryIcon && <ThemedIconRenderer icon={PrimaryIcon} size="small" theme={theme} />}
				{children}
				{ActionIcon && (
					<ThemedIconRenderer
						icon={ActionIcon}
						size="extra-small"
						theme={theme}
						background={false}
					/>
				)}
			</div>
		</ActionContainer>
	);
};

export default Handler;
