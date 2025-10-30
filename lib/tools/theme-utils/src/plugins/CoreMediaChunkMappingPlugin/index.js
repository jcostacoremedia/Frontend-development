const path = require("path");
const { Compilation } = require("webpack");
const { RawSource } = require("webpack-sources");

const NAME = "CoreMedia Chunk Mapping Plugin";
const CHUNK_PATH_BY_ID_NAME = "__chunkPathById";

class CoreMediaChunkMappingPlugin {
  constructor(options) {
    this.options = Object.assign(
      {
        chunkMappingPath: undefined,
      },
      options,
    );
    if (!this.options.chunkMappingPath) {
      throw new Error("No path for the chunkMapping was specified!");
    }
  }

  apply(compiler) {
    compiler.hooks.entryOption.tap(NAME, (context, entries) => {
      Object.values(entries).forEach((entry) => entry.import.unshift(require.resolve("./getChunkPathById")));
    });
    compiler.hooks.thisCompilation.tap(NAME, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets) => {
          const chunkPathById = compilation.chunkGroups
            .flatMap((chunkGroup) => (chunkGroup.isInitial() ? [] : chunkGroup.chunks))
            .reduce(
              (chunkPathById, chunk) =>
                Object.assign(chunkPathById, {
                  [chunk.id]: [...chunk.files][0],
                }),
              {},
            );

          // do not generate chunk mapping if no chunks are being used...
          if (Object.keys(chunkPathById).length === 0) {
            return;
          }

          const chunkMappingDirPath = path.dirname(this.options.chunkMappingPath);

          // the theme import will replace url statements with the correct path, path must be relative to the js file
          // containing the url.
          const chunkPathAsUrlByChunkId = Object.fromEntries(
            Object.entries(chunkPathById).map(([chunkId, chunkPath]) => [
              chunkId,
              `url(${path.relative(chunkMappingDirPath, chunkPath)})`,
            ]),
          );
          assets[this.options.chunkMappingPath] =
            new RawSource(`window[${JSON.stringify(CHUNK_PATH_BY_ID_NAME)}] = ${JSON.stringify(chunkPathAsUrlByChunkId, null, 2)};
`);
        },
      );
    });
  }
}

module.exports = {
  CoreMediaChunkMappingPlugin,
};
