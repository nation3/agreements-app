/** @type {import('tailwindcss').Config} */

import designSystemConfig from '../ui-components/tailwind.config.js';

module.exports = {
	...designSystemConfig,
	// purge: {
	// 	content: [
	// 		"./pages/**/*.{js,ts,jsx,tsx}",
	// 		"./components/**/*.{js,ts,jsx,tsx}",
	// 		"../ui-components/src/**/*.{js,ts,jsx,tsx}",
	// 	],
	// 	options: {
	// 	  safelist: [],
	// 	  blocklist: [/^debug-/],
	// 	  keyframes: true,
	// 	  fontFace: true,
	// 	},
	//   },
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