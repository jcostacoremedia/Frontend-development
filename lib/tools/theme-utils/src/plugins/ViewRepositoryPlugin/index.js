const fs = require("fs");
const glob = require("glob");
const path = require("path");
const { RELATIVE_TEMPLATES_PATH } = require("../../loaders/TransformFreemarkerLoader/");

const NAME = "CoreMedia View Repository Plugin";

let instance_number = 0;

class ViewRepositoryPlugin {
  constructor(config) {
    this._templateGlobPattern = config.templateGlobPattern || "**/*.*";
    this._outputPath = config.outputPath;
    this._viewRepositoryName = config.viewRepositoryName;
    this._directoryLoaderEntryName = `DirectoryLoader${++instance_number}.tmp`;
  }

  getEntry() {
    return {
      [this._directoryLoaderEntryName]: [
        require.resolve("../../loaders/DirectoryLoader") +
          `?directory=${encodeURIComponent(RELATIVE_TEMPLATES_PATH)}&pattern=${encodeURIComponent(
            this._templateGlobPattern,
          )}!`,
      ],
    };
  }

  // cleanup templates (webpack does not support deletion in watch mode)
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(NAME, (compilation) => {
      compilation.hooks.processAssets.tap(NAME, (assets) => {
        const baseOutputPath = compiler.outputPath;
        const newlyCreatedAssets = Object.keys(assets).map((asset) => path.join(baseOutputPath, asset));
        const targetPath = path.join(baseOutputPath, this._outputPath);
        const viewRepositoryTargetPath = path.join(targetPath, this._viewRepositoryName);

        glob
          .sync(this._templateGlobPattern, {
            cwd: targetPath,
            nodir: true,
          })
          // make absolute path
          .map((relativeFilePath) => path.join(targetPath, relativeFilePath)) // filter out newly created assets
          .filter((absoluteFilePath) => !newlyCreatedAssets.includes(absoluteFilePath))
          // only consider deleting files that are part of a registered view repository (other theme builds might
          // share the targetPath)
          .filter((absoluteFilePath) => !path.relative(viewRepositoryTargetPath, absoluteFilePath).startsWith("."))
          .forEach(fs.unlinkSync);

        // remove temporary JavaScript file
        const assetsToRemove = [...compilation.chunks]
          .filter((chunk) => chunk.name === this._directoryLoaderEntryName)
          .map((chunk) => [...chunk.files])
          .reduce((allFiles, files) => allFiles.concat(files), []);

        assetsToRemove.forEach((file) => {
          delete assets[file];
        });
      });
    });
  }

  getLoaderConfig() {
    return {
      loader: require.resolve("../../loaders/TransformFreemarkerLoader"),
      options: {
        outputPath: this._outputPath,
        viewRepositoryName: this._viewRepositoryName,
      },
    };
  }
}

module.exports = ViewRepositoryPlugin;
