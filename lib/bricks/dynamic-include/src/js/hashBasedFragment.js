import $ from "jquery";

import { default as Handler } from "./hashBasedFragment.Handler";
import { default as Link } from "./hashBasedFragment.Link";
import { default as Form } from "./hashBasedFragment.Form";

export { Handler, Link, Form };

export function requestParamsToString(requestParams) {
  let result = "";
  for (let name in requestParams) {
    if (!Object.prototype.hasOwnProperty.call(requestParams, name)) {
      continue;
    }
    if (result.length > 1) {
      result += "&";
    }
    result += encodeURIComponent(name);
    if (typeof requestParams[name] !== "undefined") {
      result += "=" + encodeURIComponent(requestParams[name]);
    }
  }
  return result;
}

export function stringToRequestParams(string, validParameters) {
  validParameters = validParameters || [];
  const requestParams = {};
  const hashParams = string.split("&");
  $.each(hashParams, function (_, parameter) {
    const keyValue = parameter.split("=", 2);
    const key = keyValue[0];
    const value = keyValue[1];
    if (key && validParameters.indexOf(key) > -1) {
      const decodedKey = decodeURIComponent(key);
      if (typeof value !== "undefined") {
        requestParams[decodedKey] = decodeURIComponent(value);
      } else {
        requestParams[decodedKey] = "";
      }
    }
  });

  return requestParams;
}
