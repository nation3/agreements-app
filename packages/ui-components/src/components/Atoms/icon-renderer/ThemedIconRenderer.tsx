import React from "react";

import IconRenderer, { IconRendererProps } from "./IconRenderer";

type Themes = "citizen" | "agreement" | "dispute" | "neutral";

export interface ThemedIconRendererProps extends Omit<IconRendererProps, "color" | "background"> {
	theme: Themes;
	background?: boolean;
}

const ThemedIconRenderer = ({ theme, background = true, ...props }: ThemedIconRendererProps) => {
	const themes = {
		citizen: {
			color: "primary-blue-600",
			background: "primary-blue-200",
		},
		agreement: {
			color: "primary-green-600",
			background: "primary-green-200",
		},
		dispute: {
			color: "secondary-orange-600",
			background: "secondary-orange-200",
		},
		neutral: {
			color: "neutral-600",
			background: "neutral-200",
		},
	}

	return (
		<IconRenderer
			{...props}
			color={themes[theme].color}
			background={background ? themes[theme].background : "transparent"}
		/>
	);
};

export default ThemedIconRenderer;
