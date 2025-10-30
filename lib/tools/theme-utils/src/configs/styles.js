const fs = require("node:fs");
const path = require("node:path");
const nodeSass = require("node-sass");

const MiniCssExtractWithCleanupPlugin = require("../plugins/MiniCssExtractWithCleanupPlugin");

const {
  workspace: { generateCssFileNameFromEntryPointName, generateJsFileNameFromEntryPointName, getThemeConfig },
} = require("@coremedia/tool-utils");
const deepMerge = require("./utils/deepMerge");
const { sassSmartImport, sassExcludeImport, sassImportOnce } = require("../importer/sass");

const themeConfig = getThemeConfig();

// automatically add preview entry point
const relativePreviewScssPath = "src/sass/preview.scss";
const previewScssPath = path.resolve(themeConfig.path, relativePreviewScssPath);
if (fs.existsSync(previewScssPath)) {
  themeConfig.styles.push({
    type: "webpack",
    src: relativePreviewScssPath,
    entryPointName: "preview",
    smartImport: "preview",
    include: false,
  });
}

// Create entry point(s)

const entry = {};

// 1) Theme entry point configuration

themeConfig.styles
  .filter((style) => style.type === "webpack")
  .forEach((style) => {
    const srcList = style.src instanceof Array ? style.src : [style.src];
    const chunkName = style.entryPointName;
    entry[chunkName] = srcList.map((src) => path.resolve(themeConfig.path, src));
  });

// the miniCssExtractPlugin will generate empty JS files which should be removed
// if the filename is not used by a script bundle
const possiblyEmptyJsFiles = Object.keys(entry).map(generateJsFileNameFromEntryPointName);

const neededJsFiles = themeConfig.scripts
  .filter((script) => script.type === "webpack")
  .map((script) => script.entryPointName)
  .map(generateJsFileNameFromEntryPointName);

const jsToBeRemoved = possiblyEmptyJsFiles.filter(
  (possiblyEmptyJsFile) => !neededJsFiles.includes(possiblyEmptyJsFile),
);
const cssFileName = generateCssFileNameFromEntryPointName("[name]");

const miniCssExtractPlugin = new MiniCssExtractWithCleanupPlugin(
  {
    filename: cssFileName,
    // needs to be set in case chunk splitting is used (otherwise the name would contain an unstable id)
    chunkFilename: cssFileName,
  },
  jsToBeRemoved,
);

module.exports =
  ({ dependencyCheckPlugin, mode }) =>
  (config) =>
    deepMerge(config, {
      entry: entry,
      module: {
        rules: [
          // CSS
          {
            test: /\.scss$/,
            use: [
              {
                loader: MiniCssExtractWithCleanupPlugin.loader,
              },
              {
                loader: require.resolve("css-loader"),
                options: {
                  sourceMap: mode === "development",
                },
              },
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  sourceMap: mode === "development",
                  postcssOptions: {
                    plugins: ["autoprefixer"],
                  },
                },
              },
              {
                loader: require.resolve("resolve-url-loader"),
                options: {
                  sourceMap: mode === "development",
                },
              },
              {
                loader: require.resolve("sass-loader"),
                options: {
                  sourceMap: true, // needed for resolve-url-loader, removed in css-loader
                  sassOptions: {
                    outputStyle: "expanded",
                    importer: [
                      sassSmartImport,
                      sassExcludeImport,
                      dependencyCheckPlugin.getNodeSassImporter(),
                      sassImportOnce,
                    ],
                    functions: {
                      "encodeBase64($string)": function ($string) {
                        const buffer = new Buffer($string.getValue());
                        return nodeSass.types.String(buffer.toString("base64"));
                      },
                      "encodeURIComponent($string)": function ($string) {
                        return nodeSass.types.String(encodeURIComponent($string.getValue()));
                      },
                    },
                    precision: 10,
                  },
                },
              },
            ],
          },
        ],
      },
      plugins: [miniCssExtractPlugin],
    });
