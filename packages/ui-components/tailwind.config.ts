import type { Config } from 'tailwindcss'
import n3theme from './src/theme/index';

const config: Config = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./../web-app/**/*.{js,ts,jsx,tsx}",
		"./stories/**/*.{js,ts,jsx,tsx}",
		"../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
	],
	safelist: [
		/*{
				pattern: /^w-.+/,
				variants: ["sm", "md", "lg"]
		},*/
		"from-bluesky",
		"to-greensea",
		{
			pattern: /^(bg|text)-.+/,
			variants: ["hover", "focus"],
		},
	],
	theme: {
		extend: {
			...n3theme
		}
	},
	variants: {
		extend: {
		  padding: ['responsive'],
		},
	  },
	plugins: [require("flowbite/plugin")],
};

export default config;
