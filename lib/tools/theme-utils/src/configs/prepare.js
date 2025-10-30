const deepMerge = require("./utils/deepMerge");

/**
 * @param env map of environment variables
 * @param mode production (default) or development
 */
module.exports =
  ({ env, mode }) =>
  (config) =>
    deepMerge(config, {
      mode: mode,
      stats: env.verbose ? "verbose" : "minimal",
      performance: {
        hints: false,
      },
    });
