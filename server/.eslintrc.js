module.exports = {
  settings: {
    'import/resolver': {
      typescript: {
        project: __dirname,
      },
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'airbnb-typescript/base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: { jsx: false },
  },
  env: {
    browser: false,
    node: true,
  },
  ignorePatterns: [
    'node_modules/',
    'seeders/', // sequelize seeder
    'public/', // client's webpack build
    '**/dist/', // typescript build
    // '**/*\\.test.[jt]s', // test files
    '**/*\\.config\\.[jt]s', // config files
  ],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'no-console': 'warn',
    'import/no-cycle': 'off',
    'no-shadow': 'off', // 아래 @typescript-eslint/no-shadow 과의 충돌을 피하기 위해 off 처리
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/lines-between-class-members': 'off',
    'no-use-before-define': ['error', { functions: true, classes: true }],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'acc', // array.prototype.reduce's frist arg
          'ctx', // koa.js's first arg
        ],
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-unresolved': 'error',
    'max-classes-per-file': 'off',
  },
};
