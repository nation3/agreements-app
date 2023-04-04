// tailwind.config.ts
import type { Config } from "tailwindcss";
import n3theme from './theme/index';

const config: Config = {
	content: [
		"../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
		'./packages/web-app/src/**/*.{js,ts,jsx,tsx}',
		'./packages/ui-components/src/**/*.{js,ts,jsx,tsx}',
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
