"use strict";

jest.mock("../constants");

describe("PACKAGE_MANAGER_EXECUTABLE()", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it("returns npm", () => {
    process.env.npm_config_user_agent = "npm/123";
    const constants = require("../constants");
    constants.IS_WINDOWS = false;
    const { PACKAGE_MANAGER_EXECUTABLE } = require("../paths");
    expect(PACKAGE_MANAGER_EXECUTABLE).toEqual("npm");
  });
  it("returns yarn", () => {
    process.env.npm_config_user_agent = "yarn/123";
    const constants = require("../constants");
    constants.IS_WINDOWS = false;
    const { PACKAGE_MANAGER_EXECUTABLE } = require("../paths");
    expect(PACKAGE_MANAGER_EXECUTABLE).toEqual("yarn");
  });
  it("returns pnpm", () => {
    process.env.npm_config_user_agent = "pnpm/123";
    const constants = require("../constants");
    constants.IS_WINDOWS = false;
    const { PACKAGE_MANAGER_EXECUTABLE } = require("../paths");
    expect(PACKAGE_MANAGER_EXECUTABLE).toEqual("pnpm");
  });
  it("returns npm.cmd", () => {
    process.env.npm_config_user_agent = "npm/123";
    const constants = require("../constants");
    constants.IS_WINDOWS = true;
    const { PACKAGE_MANAGER_EXECUTABLE } = require("../paths");
    expect(PACKAGE_MANAGER_EXECUTABLE).toEqual("npm.cmd");
  });
  it("returns yarn.cmd", () => {
    process.env.npm_config_user_agent = "yarn/123";
    const constants = require("../constants");
    constants.IS_WINDOWS = true;
    const { PACKAGE_MANAGER_EXECUTABLE } = require("../paths");
    expect(PACKAGE_MANAGER_EXECUTABLE).toEqual("yarn.cmd");
  });
  it("returns pnpm.cmd", () => {
    process.env.npm_config_user_agent = "pnpm/123";
    const constants = require("../constants");
    constants.IS_WINDOWS = true;
    const { PACKAGE_MANAGER_EXECUTABLE } = require("../paths");
    expect(PACKAGE_MANAGER_EXECUTABLE).toEqual("pnpm.cmd");
  });
  it("returns pnpm with undefined npm_config_user_agent", () => {
    process.env.npm_config_user_agent = undefined;
    const constants = require("../constants");
    constants.IS_WINDOWS = false;
    const { PACKAGE_MANAGER_EXECUTABLE } = require("../paths");
    expect(PACKAGE_MANAGER_EXECUTABLE).toEqual("pnpm");
  });
});
