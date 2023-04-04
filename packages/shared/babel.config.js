module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-react",
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          tailwindcss: "../shared/node_modules/tailwindcss",
        },
      },
    ],
  ],
};
