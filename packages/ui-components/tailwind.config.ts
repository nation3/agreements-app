import type { Config } from 'tailwindcss'
import n3theme, {colorClasses, variantColorClasses}  from './src/theme';

const config: Config = {
	content: [
		"./src/components/**/*.{js,ts,jsx,tsx}",
		"./stories/**/*.{js,ts,jsx,tsx}",
	],
	/* Avoid using patterns here as it will break the build */
	safelist: [
		...colorClasses,
		...variantColorClasses
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
