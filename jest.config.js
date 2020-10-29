// makes paths available to jest, see https://github.com/kulshekhar/ts-jest/issues/414#issuecomment-659057308
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.base.json");
const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: "<rootDir>/",
});

module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
  testPathIgnorePatterns: ["out/"],
  moduleNameMapper,
};
