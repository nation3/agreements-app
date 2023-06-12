const postcss = require("rollup-plugin-postcss");
const svgr = require("@svgr/rollup");
const url = require("@rollup/plugin-url");

module.exports = {
	// This function will run for each entry/format/env combination
	rollup(config, options) {
		config.plugins.push(
			postcss({
				config: {
					path: "./postcss.config.js",
				},
				extensions: [".css", ".scss"],
				minimize: true,
				inject: {
					insertAt: "top",
				},
			}),
		);

		config.plugins.push(svgr({ icon: true }));
		config.plugins.push(
			url({
				limit: 0, // Always emit files as separate assets
				include: ["**/illustrations/*.svg"], // You can adjust the pattern to match other images if needed
				fileName: "assets/[name][extname]",
				// publicPath: '/static/', // Adjust the public path as needed
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
