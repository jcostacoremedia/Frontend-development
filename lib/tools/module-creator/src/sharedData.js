"use strict";

/**
 * Returns the string in title case
 * @param  {string} str
 * @return {string}
 */
const titleCase = (str) => str.replace(str[0], str[0].toUpperCase());

module.exports = {
  titleCase,
};
