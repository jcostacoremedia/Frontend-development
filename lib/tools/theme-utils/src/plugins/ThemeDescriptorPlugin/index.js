const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const xmlBuilder = require("xmlbuilder");
const deepMerge = require("../../configs/utils/deepMerge");
const { Compilation } = require("webpack");
const { RawSource } = require("webpack-sources");
const {
  workspace: { transformLinksInJson, generateJsFileNameFromEntryPointName, generateCssFileNameFromEntryPointName },
} = require("@coremedia/tool-utils");

function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

function getTargets(code, filesToLoadByEntryPoint, entryPointFilesFilter) {
  const targets = [];
  switch (code.type) {
    case "webpack": {
      const filesToLoad = filesToLoadByEntryPoint[code.entryPointName] || [];
      const jsFilesToLoad = filesToLoad.filter(
        (filename) => !entryPointFilesFilter || entryPointFilesFilter.test(filename),
      );
      targets.push(...jsFilesToLoad);
      break;
    }
    case "copy":
      targets.push(code.target);
      break;
    case "externalLink":
    default:
      targets.push(code.src);
  }
  return targets;
}

const NAME = "CoreMedia Theme Descriptor Plugin";

class ThemeDescriptorPlugin {
  constructor(themeConfig) {
    this.themeConfig = themeConfig;
  }

  // cleanup templates (webpack does not support deletion in watch mode)
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(NAME, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets) => {
          // generate files to load per entry point
          const filesToLoadByEntryPoint = {};
          compilation.entrypoints.forEach((entryPoint, entryPointName) => {
            filesToLoadByEntryPoint[entryPointName] = [];
            entryPoint.chunks.forEach((chunk) => {
              [...chunk.files].forEach((file) => {
                filesToLoadByEntryPoint[entryPointName].push(file);
              });
            });
          });

          const root = xmlBuilder.create("themeDefinition", { encoding: "UTF-8" }, undefined).att("modelVersion", "1");

          const themeConfig = this.themeConfig;

          // general information
          root.ele("name", themeConfig.name);
          root.ele("description", themeConfig.description);

          if (themeConfig.thumbnail) {
            const thumbnailSrcPath = path.join(themeConfig.path, themeConfig.thumbnail);
            const thumbnailTargetPath = path.basename(thumbnailSrcPath);

            compilation.assets[thumbnailTargetPath] = new RawSource(fs.readFileSync(thumbnailSrcPath));
            root.ele("thumbnail", thumbnailTargetPath);
          }

          // styleSheets
          if (themeConfig.styles.length > 0) {
            const styleSheets = root.ele("styleSheets");
            const alreadyAddedStyles = new Set();
            themeConfig.styles.forEach((style) => {
              getTargets(style, filesToLoadByEntryPoint, /\.css$/)
                .filter((target) => !alreadyAddedStyles.has(target))
                .forEach((target) => {
                  // avoid windows path separators!
                  styleSheets.ele("css", normalizePath(target), {
                    notLinked: style.include !== true,
                  });
                });
            });
          }

          // javaScripts
          if (themeConfig.scripts.length > 0) {
            const javaScripts = root.ele("javaScripts");
            const alreadyAddedScripts = new Set();
            // load chunk mapping first if it exists
            if (compilation.assets[themeConfig.buildConfig.chunkMappingPath]) {
              javaScripts.ele("javaScript", normalizePath(themeConfig.buildConfig.chunkMappingPath), {
                inHead: true,
                notLinked: false,
              });
            }

            themeConfig.scripts.forEach((scripts) => {
              // avoid windows path separators!
              getTargets(scripts, filesToLoadByEntryPoint, /\.js$/)
                .filter((target) => !alreadyAddedScripts.has(target))
                .forEach((target) => {
                  alreadyAddedScripts.add(target);
                  javaScripts.ele("javaScript", normalizePath(target), {
                    ...(scripts.inHead !== undefined ? { inHead: scripts.inHead } : {}),
                    ...(scripts.defer === true ? { defer: true } : {}),
                    notLinked: scripts.include !== true,
                  });
                });
            });
          }

          // resourceBundles
          if (themeConfig.l10n.bundleEncoding) {
            root.ele("bundleEncoding", themeConfig.l10n.bundleEncoding);
          }
          if (themeConfig.l10n.bundleNames.length > 0) {
            const resourceBundles = root.ele("resourceBundles");
            themeConfig.l10n.bundleNames.forEach((bundleName) => {
              resourceBundles.ele("resourceBundle", `l10n/${bundleName}_${themeConfig.l10n.masterLanguage}.properties`);
            });
          }

          // templateSets
          const templateSets = root.ele("templateSets");
          templateSets.ele(
            "templateSet",
            normalizePath(path.relative(themeConfig.themeTargetPath, themeConfig.themeTemplatesJarTargetPath)),
          );

          const srcTargetMappings = {};
          themeConfig.scripts
            .concat(themeConfig.styles)
            .filter((code) => code.type === "copy")
            .forEach((copyCode) => {
              // copyCode always has "src" and "target"
              srcTargetMappings[copyCode.src] = copyCode.target;
            });
          themeConfig.scripts
            .filter((script) => script.type === "webpack")
            .forEach((webpackScript) => {
              // webpackScript always has "src" and "entryPoint"
              srcTargetMappings[webpackScript.src] = generateJsFileNameFromEntryPointName(webpackScript.entryPointName);
            });
          themeConfig.styles
            .filter((style) => style.type === "webpack")
            .forEach((webpackStyle) => {
              srcTargetMappings[webpackStyle.src] = generateCssFileNameFromEntryPointName(webpackStyle.entryPointName);
            });

          const absoluteSrcTargetMappings = Object.keys(srcTargetMappings).reduce((aggregator, srcPath) => {
            const targetPath = srcTargetMappings[srcPath];
            aggregator[path.resolve(themeConfig.path, srcPath)] = path.resolve(themeConfig.themeTargetPath, targetPath);
            return aggregator;
          }, {});

          const settingsLinkTransformer = (filePath, ...params) => {
            const assetPath = params[0];
            const absoluteFilePath = path.resolve(themeConfig.path, filePath);
            const newAbsoluteTargetPath = absoluteSrcTargetMappings[absoluteFilePath];

            // return a path relative to the assetPath
            if (newAbsoluteTargetPath) {
              const absoluteSettingsDirPath = path.dirname(path.resolve(themeConfig.themeTargetPath, assetPath));

              return normalizePath(path.relative(absoluteSettingsDirPath, newAbsoluteTargetPath));
            }
            // no matching paths in theme config
            throw new Error(
              `Could not find "${filePath}" in theme build. Please make sure that you have configured the file in the theme configuration.`,
            );
          };

          Object.keys(assets)
            .filter((assetKey) => /(.+)\.settings\.json$/.test(assetKey))
            .forEach((key) => {
              const settingsJson = JSON.parse(assets[key]._value);
              transformLinksInJson(settingsJson, settingsLinkTransformer, key);
              assets[key] = new RawSource(JSON.stringify(settingsJson, null, 2));
            });

          // hard coded configuration for preview settings
          // this is sufficient as long as we do not have a generic settings mechanism in the workspace
          const relativePreviewSettingsFolder = "settings";
          const relativePreviewSettingsPath = path.join(relativePreviewSettingsFolder, "Preview.settings.json");

          const previewAsset = assets[relativePreviewSettingsPath];
          const previewAssetJson = previewAsset ? JSON.parse(previewAsset._value) : {};

          let previewCss = {};
          if (filesToLoadByEntryPoint["preview"].find((filename) => /preview.css$/.test(filename)) !== undefined) {
            previewCss = {
              previewCss: [
                {
                  $Link: normalizePath(
                    path.relative(
                      relativePreviewSettingsFolder,
                      filesToLoadByEntryPoint["preview"].find((filename) => /preview.css$/.test(filename)),
                    ),
                  ),
                },
              ],
            };
          }

          const previewSettings = JSON.stringify(
            deepMerge(previewAssetJson, {
              previewJs: [
                {
                  $Link: normalizePath(
                    path.relative(
                      relativePreviewSettingsFolder,
                      filesToLoadByEntryPoint["preview"].find((filename) => /preview.js$/.test(filename)),
                    ),
                  ),
                },
              ],
              ...previewCss,
            }),
            null,
            2,
          );
          assets[relativePreviewSettingsPath] = new RawSource(previewSettings);

          // settings
          const settings = root.ele("settings");
          Object.keys(assets)
            .filter((assetKey) => /(.+)\.settings\.json$/.test(assetKey))
            .sort((assetKeyA, assetKeyB) => assetKeyA.localeCompare(assetKeyB))
            .forEach((assetKey) => {
              settings.ele("setting", normalizePath(assetKey));
            });

          const xml = root.end({
            pretty: true,
            indent: "  ",
            newline: "\n",
          });

          mkdirp.sync(path.dirname(themeConfig.descriptorTargetPath));
          fs.writeFileSync(themeConfig.descriptorTargetPath, xml, {
            encoding: "UTF-8",
          });
        },
      );
    });
  }
}

module.exports = ThemeDescriptorPlugin;
