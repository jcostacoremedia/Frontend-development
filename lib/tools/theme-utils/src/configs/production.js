const deepMerge = require("./utils/deepMerge");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

/**
 * @module contains the webpack configuration for the production environment
 */
module.exports = () => (config) =>
  deepMerge(config, {
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },
  });
