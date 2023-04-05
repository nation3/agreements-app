// tailwind.config.ts
import type { Config } from "tailwindcss";
import n3theme from '@nation3/ui-components/theme';
import presetEnv from '../../shared/node_modules/@babel/preset-env';
import presetReact from '../../shared/node_modules/@babel/preset-env';

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			// as soon as the theme is fully mature and covering all aspects we can load it up directly alone as theme.
			// ...n3theme
		},
	},
	plugins: [require("flowbite/plugin")],
	presets: [
		presetEnv(),
		presetReact(),
	  ],
};

export default config;
