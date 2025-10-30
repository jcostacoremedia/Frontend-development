const fs = require("fs");
const path = require("path");
const nodeSass = require("node-sass");
const closestPackage = require("closest-package");

const {
  workspace: { getThemeConfig, getIsSmartImportModuleFor },
  packages,
  dependencies: { flattenDependencies, getDependencies, getDependentsFirstLoadOrder },
} = require("@coremedia/tool-utils");
const { resolveScssByNameExpander } = require("./utils");

const REGEX = /(~(.+))?\?smart-import-(variables|partials)/;
const SASS_PATHS = ["src/sass", "src"];

const themeConfig = getThemeConfig();

function getSmartImportPath(dependency, varsOrPartials) {
  const candidates = SASS_PATHS.map((sassPath) =>
    path.join(path.dirname(dependency.getPkgPath()), sassPath, varsOrPartials),
  )
    .map((candidate) => `${candidate.replace(/\\/g, "/")}`)
    .filter((candidate) => fs.existsSync(resolveScssByNameExpander(candidate)));
  return candidates.length > 0 ? candidates[0] : null;
}

function getVariant(prev) {
  const styleEntriesWithSmartImport = themeConfig.styles.filter(
    (style) => style.type === "webpack" && style.smartImport,
  );

  const resolvedPrev = path.resolve(prev);
  const styleEntryPoint = styleEntriesWithSmartImport.find((style) => {
    const srcList = style.src instanceof Array ? style.src : [style.src];
    return srcList.map((src) => path.resolve(src)).includes(resolvedPrev);
  });
  return styleEntryPoint ? styleEntryPoint.smartImport : null;
}

/**
 * @param dependencyPathsByPackageName
 * @param {Array<NodeModule>} dependencies
 * @returns {Record<string, string>}
 */
function collectDependencyPathsByPackageName(dependencyPathsByPackageName, dependencies) {
  dependencies.forEach((dependency) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!dependencyPathsByPackageName.hasOwnProperty(dependency.getName())) {
      dependencyPathsByPackageName[dependency.getName()] = dependency.getPkgPath();
      collectDependencyPathsByPackageName(dependencyPathsByPackageName, dependency.getDependencies());
    }
  });
  return dependencyPathsByPackageName;
}

function calculateSmartImport(prev) {
  const variant = getVariant(prev);
  const themeDependencies = getDependencies(themeConfig.pkgPath, getIsSmartImportModuleFor(null));
  return {
    root: prev,
    variant: variant,
    dependencyPathsByPackageName: collectDependencyPathsByPackageName({}, themeDependencies),
    dependentsFirstLoadOrder: getDependentsFirstLoadOrder(themeDependencies, themeConfig.packageName),
    // filter partials (=> css generating code) that would be included twice.
    // we always assume that the variant is loaded in addition to the default.
    whiteList: flattenDependencies(themeDependencies)
      .filter(getIsSmartImportModuleFor(variant))
      .map((dependency) => dependency.getName()),
  };
}

const sassSmartImports = new WeakMap();

module.exports = function (url, prev, done) {
  if (!sassSmartImports.has(this.webpackLoaderContext)) {
    sassSmartImports.set(this.webpackLoaderContext, calculateSmartImport(prev));
  }
  // take the prev of the first import to get variant information (prev is the entry point)
  const sassSmartImport = sassSmartImports.get(this.webpackLoaderContext);

  const match = REGEX.exec(url);
  if (match && match.length > 0) {
    const { whiteList } = sassSmartImport;

    const [, , providedPackageName, varsOrPartials] = match;

    // either package name is provided explicitly or we need to evaluate it from prev
    let packageName;
    let pkgJson;
    if (providedPackageName) {
      packageName = providedPackageName;
      pkgJson = sassSmartImport.dependencyPathsByPackageName[providedPackageName];
    } else {
      pkgJson = closestPackage.sync(prev);
      packageName = packages.getJsonByFilePath(pkgJson).name;
    }

    let dependenciesToImport;
    if (varsOrPartials === "variables") {
      // variables need dependents first load order
      dependenciesToImport = sassSmartImport.dependentsFirstLoadOrder[packageName] || [];
    } else {
      // for partials the direct load order specified through the dependency hierarchy is sufficient (which are our dependencies, we just don't flatten them)
      dependenciesToImport = getDependencies(pkgJson, getIsSmartImportModuleFor(null));
    }

    // Get scss paths of the dependent bricks
    const sassPaths = dependenciesToImport.map((dependency) => {
      const includeParts = whiteList.includes(dependency.getName()) && getSmartImportPath(dependency, varsOrPartials);
      return includeParts ? includeParts : `~${dependency.getName()}?smart-import-${varsOrPartials}`;
    });

    const scssContent = sassPaths.map((sassPath) => `@import "${sassPath}";`).join("\n");

    done({
      contents: scssContent,
      // also rewrite filename otherwise the loop protection might abort the scss compilation
      // we also need to pass a timestamp as otherwise the import is cached leading other import loaders to be skipped
      // which e.g. causes scss to be included multiple times (which is avoided by sassImportOnce)
      file:
        path.resolve(path.dirname(pkgJson), "smart-import-" + varsOrPartials + ".scss") + "?" + new Date().getTime(),
    });
  } else {
    done(nodeSass.types.NULL);
  }
};
