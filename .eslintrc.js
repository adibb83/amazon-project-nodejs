module.exports = {
  parser: '@typescript-eslint/parser', // specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // allows for the parsing of modern ECMAScript features
    sourceType: 'module', // allows for the use of imports
  },
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    // configure and specify rules, e.g.
    // '@typescript-eslint/explicit-function-return-type': 'off,
    '@typescript-eslint/no-explicit-any': 'off',
  },
  env: {
    node: true,
  },
  globals: {
    Atomics: 'readonly',
    Int32Array: 'readonly',
    SharedArrayBuffer: 'readonly',
    Promise: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
  },
};
