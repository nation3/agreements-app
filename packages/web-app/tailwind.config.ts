// tailwind.config.ts
import type { Config } from "tailwindcss";
import n3theme from '../theme/index';

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			// as soon as the theme is fully mature and covering all aspects we can load it up directly alone as theme.
			...n3theme
		},
	},
	plugins: [require("flowbite/plugin")],
};

export default config;
