/** @type {import('tailwindcss').Config} */

module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
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
			colors: {
				nation3: {
					bg_dark: "#1f2938",
					bg_light: "#f4faff",
					bg_grey: "#fafafa",
				},
				bluesky: {
					100: "#D9F1FF",
					200: "#A1DDFF",
					300: "#69c9ff",
					400: "#44B7F9",
					500: "#209EE6",
					600: "#0880C4",
					700: "#00659F",
					800: "#004C78",
					900: "#003654",
					DEFAULT: "#69c9ff",
				},
				greensea: {
					100: "#D9FFE6",
					200: "#AFF8CE",
					300: "#88F1BB",
					400: "#5DE2A7",
					500: "#36D399",
					600: "#17B689",
					700: "#009A73",
					800: "#00785C",
					900: "#005441",
					DEFAULT: "#88F1BB",
				},
			},
		},
	},
	plugins: [require("flowbite/plugin")],
};
