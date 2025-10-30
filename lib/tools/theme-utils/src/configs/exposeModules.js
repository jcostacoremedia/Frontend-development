const resolveFrom = require("resolve-from");
const {
  workspace: { getThemeConfig },
} = require("@coremedia/tool-utils");
const deepMerge = require("./utils/deepMerge");

// provide some modules as global variable as long as the "cm-wcs" workspace still relies on it
// the mapping is: moduleName => globalVariableName
const modulesToExpose = {
  jquery: "coremedia.blueprint.$",
  "@coremedia/brick-dynamic-include": "coremedia.blueprint.basic",
};

const themeConfig = getThemeConfig();
const rules = [];

for (let module of Object.keys(modulesToExpose)) {
  const globalVariableName = modulesToExpose[module];
  try {
    const path = resolveFrom(themeConfig.path, module);
    rules.push({
      test: path,
      loader: require.resolve("expose-loader"),
      options: {
        exposes: globalVariableName,
      },
    });
  } catch (e) {
    // module not found, nothing to expose
  }
}

module.exports = () => (config) =>
  deepMerge(config, {
    module: {
      rules: rules,
    },
  });
