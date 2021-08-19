module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  plugins: ['import', 'promise', 'compat', 'node', 'prettier'],
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 9,
    ecmaFeatures: {
      sourceType: 'module',
      jsx: false,
    },
    allowImportExportEverywhere: true,
  },
  ignorePatterns: ['node_modules/'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'import/no-cycle': 'off',
    'no-shadow': 'warn',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'acc', // array.prototype.reduce's frist arg
        ],
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-unresolved': 'off', // for webpack path alias
    'import/extensions': ['error', 'never', { js: 'always' }],
  },
};
