const path = require("path");

module.exports = {
	stories: ["../**/*.stories.mdx", "../**/*.stories.@(js|jsx|ts|tsx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		{
			name: "@storybook/addon-postcss",
			options: {
				postcssLoaderOptions: {
					implementation: require("postcss"),
				},
			},
		},
		"storybook-dark-mode",
	],
	framework: "@storybook/react",
	core: {
		builder: "@storybook/builder-webpack5",
	},
	webpackFinal: async (config) => {
		config.module.rules.push({
			test: /\.scss$/,
			use: ["style-loader", "css-loader", "sass-loader"],
			include: path.resolve(__dirname, "../"),
		});
		config.resolve.alias["@"] = path.resolve(__dirname, "../src");
		config.resolve.alias["tailwindcss"] = path.resolve(
			__dirname,
			"../tailwind-package/node_modules/tailwindcss",
		);
		config.resolve.alias["@tailwindcss/ui"] = path.resolve(
			__dirname,
			"../tailwind-package/node_modules/@tailwindcss/ui",
		);
		config.resolve.alias["@tailwindcss/forms"] = path.resolve(
			__dirname,
			"../tailwind-package/node_modules/@tailwindcss/forms",
		);
		return config;
	},
};
