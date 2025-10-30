import "url-polyfill";

// attempt to find the path of the currently executed script (=this file)
const currentScript =
  document.currentScript || Array.prototype.slice.call(document.getElementsByTagName("script"), -1)[0];
const baseUrl = new URL(currentScript ? currentScript.src : window.location.href);

function parse(url) {
  return url.substring(4, url.length - 1);
}

// eslint-disable-next-line no-undef
__webpack_get_script_filename__ = function (chunkId) {
  const chunkPathById = window["__chunkPathById"];
  const targetUrl = new URL(parse(chunkPathById[chunkId]), baseUrl);
  return targetUrl.pathname + targetUrl.search + targetUrl.hash;
};
