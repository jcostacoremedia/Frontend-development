const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const NAME = "CoreMedia Mini Css Extract With Cleanup Plugin";

class MiniCssExtractWithCleanupPlugin extends MiniCssExtractPlugin {
  constructor(config, jsToRemove) {
    super(config);
    this._jsToRemove = jsToRemove;
  }

  apply(compiler) {
    super.apply(compiler);
    compiler.hooks.thisCompilation.tap(NAME, (compilation) => {
      compilation.hooks.processAssets.tap(NAME, (assets) => {
        this._jsToRemove.forEach((jsToRemove) => {
          delete assets[jsToRemove];
        });
      });
    });
  }
}

module.exports = MiniCssExtractWithCleanupPlugin;
