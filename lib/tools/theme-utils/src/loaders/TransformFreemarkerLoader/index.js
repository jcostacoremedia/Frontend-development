const closestPackage = require("closest-package");
const fs = require("fs");
const loaderUtils = require("loader-utils");
const path = require("path");
const { packages } = require("@coremedia/tool-utils");

const RELATIVE_TEMPLATES_PATH = path.join("src", "templates");
const FTL_REFERENCE_PATTERN = /<#(import|include)\s+"([^"]+)"([^>]*)>/g;

function resolveFreemarkerRef(ref, sourceFile) {
  const baseDir = path.dirname(sourceFile);
  // check for asterisk pattern
  const asteriskPattern = ref.split("*");

  const containsAsterisk = asteriskPattern.length > 1;
  // freemarker imports/includes may contain a single asterisk, the spec is described here:
  // https://freemarker.apache.org/docs/ref_directive_include.html#ref_directive_include_acquisition
  const validAsteriskPattern = asteriskPattern.length === 2;

  if (validAsteriskPattern) {
    const [prefix, suffix] = asteriskPattern;
    let currentDir = prefix ? path.join(baseDir, prefix) : baseDir;
    while (currentDir) {
      let candidate = path.join(currentDir, suffix);
      if (fs.existsSync(candidate)) {
        return candidate;
      }

      const lastDir = currentDir;
      currentDir = path.join(currentDir, "../");
      if (lastDir === currentDir) {
        // top most folder reached, cannot find matching file
        break;
      }
    }
  }

  const candidate = path.resolve(baseDir, ref);
  if (fs.existsSync(candidate)) {
    return candidate;
  }

  let message = `Could not resolve file reference in include/import directive: "${ref}" in source file "${sourceFile}".`;
  if (containsAsterisk) {
    message += `\n\nMake sure that the used asterisk pattern is valid (see: https://freemarker.apache.org/docs/ref_directive_include.html#ref_directive_include_acquisition).`;
  }

  throw new Error(message);
}

module.exports = function loader(content) {
  // cannot be cached because a plugin configuration in clean.js clears the templates that have not been provided by the last build
  this.cacheable(false);
  const sourcePath = this.resourcePath;

  const options = loaderUtils.getOptions(this) || {};
  const outputPath = options.outputPath || "";
  const viewRepositoryName = options.viewRepositoryName;
  if (!viewRepositoryName) {
    throw new Error(`No view repository name provided.`);
  }

  const packageJsonPath = closestPackage.sync(sourcePath);
  const templatesPath = path.join(path.dirname(packageJsonPath), "src/templates");

  const modulesToLoad = [];
  const result = content.replace(
    FTL_REFERENCE_PATTERN,
    (wholeExpression, directive, ftlPath, tail, index, wholeTemplate) => {
      // checking if the include/import is part of a comment which could lead to errors if processed further
      const checkForComment = wholeTemplate.slice(0, index);
      if (checkForComment.lastIndexOf("<#--") > checkForComment.lastIndexOf("-->")) {
        return wholeExpression;
      } else {
        const resolvedPath = resolveFreemarkerRef(ftlPath, sourcePath);

        // if the resolved path is outside the templates path, it will be moved to freemarkerLibs by the
        // ViewRepositoryPlugin
        if (path.relative(templatesPath, resolvedPath).startsWith("..")) {
          // the library needs to be loaded as well
          modulesToLoad.push(resolvedPath);

          // calculate where the library will be placed in the target directory
          // this could be achieved by evaluating the result of the prior loadModule call
          const packageJsonPath = closestPackage.sync(resolvedPath);
          const packageJson = packages.getJsonByFilePath(packageJsonPath);
          const transformedPath = `*/${viewRepositoryName}/freemarkerLibs/${packageJson.name}/${path.basename(
            resolvedPath,
          )}`;
          return `<#${directive} ${JSON.stringify(transformedPath)}${tail}>`;
        }

        // otherwise no transformation needed
        return wholeExpression;
      }
    },
  );

  const packageJson = packages.getJsonByFilePath(packageJsonPath);
  const relativePathFromPackage = path.relative(path.dirname(packageJsonPath), sourcePath);
  let middleSegment = path.relative(RELATIVE_TEMPLATES_PATH, relativePathFromPackage);
  // if the middle segment loads to a path outside the templates path, put it into freemarkerLibs
  if (middleSegment.startsWith("..")) {
    middleSegment = path.join("freemarkerLibs", packageJson.name, path.basename(relativePathFromPackage));
  }
  this.emitFile(path.join(outputPath, viewRepositoryName, middleSegment), result);

  return `${modulesToLoad.map((moduleToLoad) => `import ${JSON.stringify(moduleToLoad)};`).join("\n")}
export default "";`;
};

module.exports.RELATIVE_TEMPLATES_PATH = RELATIVE_TEMPLATES_PATH;
