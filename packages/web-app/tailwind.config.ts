// tailwind.config.ts
import type { Config } from "tailwindcss";
import n3theme from '../designTokens/index';

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: n3theme.colors,
			fontSize: n3theme.fontSize,
			fontFamily: n3theme.fontFamily,
			boxShadow: n3theme.elevation,
			borderRadius: n3theme.roundness,
		},
	},
	plugins: [require("flowbite/plugin")],
};

export default config;
