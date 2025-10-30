"use strict";

const { IS_WINDOWS } = require("../lib/constants");

function getPackageManagerExecutable() {
  // default is pnpm
  if (process.env.npm_config_user_agent?.startsWith("npm")) {
    return IS_WINDOWS ? "npm.cmd" : "npm";
  } else if (process.env.npm_config_user_agent?.startsWith("yarn")) {
    return IS_WINDOWS ? "yarn.cmd" : "yarn";
  } else {
    return IS_WINDOWS ? "pnpm.cmd" : "pnpm";
  }
}

module.exports = {
  PACKAGE_MANAGER_EXECUTABLE: getPackageManagerExecutable(),
};
