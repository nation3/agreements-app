const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    config.plugins.push(
      postcss({
        config: {
            path: './postcss.config.js'
        },
        extensions: ['.css'],
        minimize: true,
        inject: {
            insertAt: 'top'
        }
      })
    );
    return config; // always return a config.
  },
};
