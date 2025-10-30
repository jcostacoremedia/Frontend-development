const nodeSass = require("node-sass");

const { resolveScss } = require("./utils");

const excludeLists = new WeakMap();

module.exports = function (url, prev, done) {
  const excludePattern = /\?exclude$/;
  const originalUrl = url;

  let result = nodeSass.types.NULL;
  // Create an exclude list if it doesn't exist
  if (!excludeLists.has(this.webpackLoaderContext)) {
    excludeLists.set(this.webpackLoaderContext, {});
  }
  const excludeList = excludeLists.get(this.webpackLoaderContext);

  const containsExclude = excludePattern.test(url);
  if (containsExclude) {
    url = url.replace(excludePattern, "");
    result = {
      filename: url,
    };
  }

  const resolvedAbsolutePath = resolveScss(url, prev);

  if (containsExclude) {
    // check if exclude could be resolved, otherwise trigger error:
    if (!resolvedAbsolutePath) {
      done(new Error(`Could not resolve url: "${originalUrl}" which was marked for exclude.`));
      return;
    }
    excludeList[resolvedAbsolutePath] = true;
  }

  if (resolvedAbsolutePath && resolvedAbsolutePath in excludeList) {
    done({
      contents: "",
      filename: "excluding:" + resolvedAbsolutePath,
    });
  } else {
    done(result);
  }
};
