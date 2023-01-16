import "../src/styles.css";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	darkMode: {
		darkClass: "dark",
		stylePreview: true,
	},
	backgrounds: {
		values: [
			{ name: "n3_dark", value: "#1f2938" },
			{ name: "n3_light", value: "#f4faff" },
			{ name: "n3_gray", value: "#fafafa" },
		],
	},
};
