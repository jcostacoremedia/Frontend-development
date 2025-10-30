"use strict";

const fs = require("node:fs");
const https = require("node:https");
const axios = require("axios").default;

const API_PATH = "/rest/api/themeImporter";

class HttpError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    Error.captureStackTrace(this, HttpError);
  }
}

/**
 * Returns a Promise for executing a request.
 * @param {AxiosRequestConfig} config
 * @returns {Promise}
 * @private
 */
const request = (config) => {
  return new Promise((resolve, reject) => {
    try {
      axios
        .request(config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          const response = error.response;
          let httpError = error;

          if (response.status === 401) {
            let message =
              response.data.cause === "unknown"
                ? "Invalid username or password."
                : "You are not a member of any developer group.";
            httpError = new HttpError(
              "EUNAUTHORIZED",
              `${response.status} ${response.statusText}: ${
                /login$/.test(config.url)
                  ? message
                  : "Your API key is invalid and has been removed. Please login again."
              }`,
            );
          } else if (response.status === 404) {
            httpError = new HttpError(
              "ENOTFOUND",
              `${response.status} ${response.statusText}: The server has not found anything matching the Request-URI. Please check the specified Studio URL.`,
            );
          } else if (response.status === 409) {
            let errors = response.data;
            httpError = new HttpError(
              "ECONFLICT",
              `${response.status} ${response.statusText}: Could not upload theme because of problems with following files:
                ${errors?.failedPaths}
                Please check the status of the files in Studio.`,
            );
          } else {
            httpError = new HttpError(
              "EMISC",
              `${response.status} ${response.statusText}: Please contact your system administrator. ${
                response.data && `, cause: ${response.data}`
              }`,
            );
          }
          reject(httpError);
        });
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Returns a config object to be passed to request function.
 * @param {URL} url
 * @param {Object} options
 * @returns {AxiosRequestConfig}
 * @private
 */
const getOptions = (url, options) => {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  const config = {
    url: url,
    method: "POST",
    httpsAgent: agent,
  };

  if (options && typeof options === "object") {
    if (options.proxy && typeof options.proxy === "string") {
      Object.assign(config, {
        proxy: new URL(options.proxy),
      });
    }
    if (options.auth && typeof options.auth === "object") {
      Object.assign(config, {
        auth: options.auth,
      });
    }
    if (options.apiKey && typeof options.apiKey === "string") {
      Object.assign(config, {
        headers: {
          Authorization: `CMAPIKey ${options.apiKey}`,
        },
      });
    }
    if (options.formData && typeof options.formData === "object") {
      Object.assign(config, {
        data: options.formData,
      });
      Object.assign(config.headers, {
        "Content-Type": "multipart/form-data",
      });
    }
  }
  return config;
};

/**
 * Returns a Promise for requesting an API key.
 * @param {string} baseUrl - the base URL
 * @param {string} proxy - the proxy URL
 * @param {string} username - the username
 * @param {string} password - the password or token
 * @returns {Promise} - promise resolving to object with url and apiKey attributes
 */
const login = (baseUrl, proxy, username, password) => {
  const url = new URL(`${API_PATH}/login`, baseUrl);
  return new Promise((resolve, reject) => {
    try {
      const options = getOptions(url, {
        proxy,
        auth: {
          username: username,
          password: password,
        },
      });

      request(options)
        .then((value) => {
          resolve({
            url,
            apiKey: value,
          });
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Returns a Promise for requesting a logout.
 * @param {string} baseUrl
 * @param {string} proxy
 * @param {string} apiKey
 * @returns {Promise}
 */
const logout = (baseUrl, proxy, apiKey) => {
  const url = new URL(`${API_PATH}/logout`, baseUrl);
  return new Promise((resolve, reject) => {
    const options = getOptions(url, {
      proxy,
      apiKey,
    });

    request(options)
      .then(() => {
        try {
          resolve();
        } catch (e) {
          reject(new Error("API key couldn't be deleted on local disk, but has been invalidated on server side."));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};

/**
 * Returns a Promise for requesting a user verification.
 * @param {string} baseUrl
 * @param {string} proxy
 * @param {string} apiKey
 * @returns {Promise}
 */
const whoami = (baseUrl, proxy, apiKey) => {
  const url = new URL(`${API_PATH}/whoami`, baseUrl);
  return new Promise((resolve, reject) => {
    const options = getOptions(url, {
      proxy,
      apiKey,
    });
    request(options)
      .then((response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

/**
 * Returns a Promise for requesting a theme upload.
 * @param {string} baseUrl
 * @param {string} proxy
 * @param {string} apiKey
 * @param {string} file
 * @param {string} [clean=false]
 * @returns {Promise}
 */
const upload = (baseUrl, proxy, apiKey, file, clean = "false") => {
  const url = new URL(`${API_PATH}/upload`, baseUrl);
  return new Promise((resolve, reject) => {
    const options = getOptions(url, {
      proxy,
      apiKey,
      formData: {
        path: "/Themes",
        clean,
        file: fs.createReadStream(file),
      },
    });

    request(options)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
};

/**
 * Returns a Promise for requesting a theme upload for deployment.
 * @param {string} baseUrl
 * @param {string} proxy
 * @param {string} apiKey
 * @param {string} file
 * @returns {Promise}
 */
const deploy = (baseUrl, proxy, apiKey, file) => {
  const url = new URL(`${API_PATH}/deploy`, baseUrl);
  return new Promise((resolve, reject) => {
    const options = getOptions(url, {
      proxy,
      apiKey,
      formData: {
        path: "/Themes",
        file: fs.createReadStream(file),
      },
    });

    request(options)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
};

/**
 * Returns a Promise for requesting a file delete.
 * @param {string} baseUrl
 * @param {string} proxy
 * @param {string} apiKey
 * @param {string} file
 * @returns {Promise}
 */
const deleteFile = (baseUrl, proxy, apiKey, file) => {
  const url = new URL(`${API_PATH}/delete`, baseUrl);
  return new Promise((resolve, reject) => {
    const options = getOptions(url, {
      proxy,
      apiKey,
      formData: {
        path: "/Themes",
        file,
      },
    });

    request(options)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
};

/**
 * api module
 * @module
 */
module.exports = {
  login,
  logout,
  whoami,
  upload,
  deploy,
  deleteFile,
};
