import type { Config } from 'tailwindcss'
import n3theme from './src/theme/index';
import { variantColorClasses } from './src/utils/theme';

const config: Config = {
	content: [
		"./src/components/**/*.{js,ts,jsx,tsx}",
		"./stories/**/*.{js,ts,jsx,tsx}",
	],
	/* Avoid using patterns here as it will break the build */
	safelist: [
		// ...variantColorClasses
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
};

export default config;
