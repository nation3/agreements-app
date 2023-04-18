/** @type {import('tailwindcss').Config} */

import designSystemConfig from '../ui-components/tailwind.config.js';

module.exports = {
	...designSystemConfig,
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"../../node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
	],
	// purge: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			...designSystemConfig.theme
		},
	},
	plugins: [require("flowbite/plugin")],
};