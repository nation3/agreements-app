const path = require("path");
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ["../**/*.stories.mdx", "../**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions", {
    name: "@storybook/addon-styling",
    options: {
      postCss: {
        implementation: require("postcss")
      }
    }
  }, "@storybook/addon-mdx-gfm"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript-plugin'
  },
  webpackFinal: async config => {
	// this modifies the existing image rule to exclude .svg files
    // since we want to handle those files with @svgr/webpack
    const imageRule = config.module.rules.find(rule => rule.test.test('.svg'))
    imageRule.exclude = /\.svg$/

    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../")
    });
    config.module.rules.unshift({
      test: /\.svg$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      include: path.resolve(__dirname, "../")
    });
    // config.resolve.plugins = [...(config.resolve.plugins || []), new TsconfigPathsPlugin({extensions: config.resolve.extensions})]
    config.resolve.alias["ui-components"] = path.resolve(__dirname, "../src");
    config.resolve.alias["tailwindcss"] = path.resolve(__dirname, "../tailwind-package/node_modules/tailwindcss");
    config.resolve.alias["@tailwindcss/ui"] = path.resolve(__dirname, "../tailwind-package/node_modules/@tailwindcss/ui");
    config.resolve.alias["@tailwindcss/forms"] = path.resolve(__dirname, "../tailwind-package/node_modules/@tailwindcss/forms");

    console.log(config);
    return config;
  },
  docs: {
    autodocs: true
  }
};