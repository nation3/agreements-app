const postcss = require("rollup-plugin-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const svg = require("rollup-plugin-svg");
// const img = require("rollup-plugin-img");

module.exports = {
	// This function will run for each entry/format/env combination
	rollup(config, options) {
		config.plugins.push(
			postcss({
				config: {
					path: "./postcss.config.js",
				},
				extensions: [".css"],
				minimize: true,
				inject: {
					insertAt: "top",
				},
			}),
		);
		// Add the SVG plugin
		config.plugins.push(
			svg({
				// Optional: Specify React as the DOM renderer
				dom: "React",
			}),
		);

		// Add the image plugin
		// config.plugins.push(
		//   img({
		//     limit: 10000, // Limit for data URLs. Files larger than this will be imported as file URLs.
		//   })
		// );
		return config; // always return a config.
	},
};
