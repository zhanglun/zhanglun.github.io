const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
  webpackFinal: async (config) => {
    // Prevent webpack from using Storybook CSS rules to process CSS modules
    config.module.rules.find(
      (rule) => rule.test.toString() === "/\\.css$/"
    ).exclude = /\.module\.css$/;

    // Tell webpack what to do with CSS modules
    config.module.rules.push({
      test: /\.module\.css$/,
      include: path.resolve(__dirname, "../src"),
      use: [
        {
          loader: "style-loader",
          options: {
            modules: {
              namedExport: true,
            },
          },
        },
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: {
              namedExport: true,
            },
          },
        },
      ],
    });
    config.module.rules.push({
      test: /\.scss$/,
      include: path.resolve(__dirname, "../src"),
      use: [
        {
          loader: "style-loader",
          options: {
            modules: {
              namedExport: true,
            },
          },
        },
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: {
              namedExport: true,
            },
          },
        },
        {
          loader: "sass-loader"
        }
      ],
    });
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/];
    // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
    config.module.rules[0].use[0].options.plugins.push(
      require.resolve("babel-plugin-remove-graphql-queries")
    );
    return config;
  },
};
