const nodeSass = require("node-sass");

const { resolveScss } = require("./utils");

const importOnceCaches = new WeakMap();

module.exports = function (url, prev, done) {
  // Create an import cache if it doesn't exist
  if (!importOnceCaches.has(this.webpackLoaderContext)) {
    importOnceCaches.set(this.webpackLoaderContext, {});
  }
  const importOnceCache = importOnceCaches.get(this.webpackLoaderContext);

  const resolvedAbsolutePath = resolveScss(url, prev);
  if (resolvedAbsolutePath && resolvedAbsolutePath in importOnceCache) {
    // already imported, return empty string as content
    done({
      contents: "",
    });
  } else {
    // add new file to cache
    importOnceCache[resolvedAbsolutePath] = true;
    // leave handling to other importers
    done(nodeSass.types.NULL);
  }
};
