const escapeStringRegexp = require("escape-string-regexp");
const path = require("path");
const flow = require("lodash/fp/flow");
const { DependencyCheckWebpackPlugin } = require("@coremedia/dependency-check");
const {
  workspace: { COREMEDIA_SCOPE, EXAMPLE_SCOPE, getThemeConfig, getIsSmartImportModuleFor },
  dependencies: { getDependencies },
} = require("@coremedia/tool-utils");

const prepare = require("./prepare");
const clean = require("./clean");
const themeZip = require("./themeZip");
const production = require("./production");
const development = require("./development");
const scripts = require("./scripts");
const exposeModules = require("./exposeModules");
const styles = require("./styles");
const staticResources = require("./staticResources");

const themeConfig = getThemeConfig();
const themeDependencies = getDependencies(themeConfig.pkgPath, getIsSmartImportModuleFor(null));

const PATH_SEP_ESCAPED = escapeStringRegexp(path.sep);
const exclude = [
  // All modules but CoreMedia specific modules
  new RegExp(
    ["", "node_modules", `(?!${escapeStringRegexp(COREMEDIA_SCOPE)}|${escapeStringRegexp(EXAMPLE_SCOPE)}).+`, ""].join(
      PATH_SEP_ESCAPED,
    ),
  ),
  new RegExp(["", "legacy", ""].join(PATH_SEP_ESCAPED)),
  new RegExp(["", "vendor", ""].join(PATH_SEP_ESCAPED)),
  // exclude variable files imported via smart import from dependency check as
  // the load order is calculated in a way that it might not match the actual dependencies
  new RegExp(["", "smart-import-variables.scss"].join(PATH_SEP_ESCAPED)),
];

const dependencyCheckPlugin = new DependencyCheckWebpackPlugin({
  // do not pass include here, this is only for es-lint
  exclude: exclude,
});

// merge different webpack configurations (order matters!)
module.exports = (env, { mode = "production" }) =>
  flow(
    prepare({ env, mode }),
    clean(),
    staticResources(),
    styles({ dependencyCheckPlugin, mode }),
    scripts({ exclude, dependencyCheckPlugin }),
    exposeModules(),
    mode === "development" ? development() : production(),
    themeZip(),
  )({
    context: themeConfig.path,
    output: {
      path: themeConfig.themeTargetPath,
    },
    resolve: {
      modules: [
        "node_modules",
        ...themeDependencies.map((dependency) => path.join(path.dirname(dependency.getPkgPath()), "node_modules")),
      ],
    },
  });
