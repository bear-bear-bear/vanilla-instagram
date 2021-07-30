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
    'airbnb-base',
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
  ignorePatterns: ['node_modules', 'dist', 'public', '*\\.test.[jt]s', '*\\.config\\.[jt]s'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'no-console': 'warn',
    'import/no-cycle': 'off',
    'no-shadow': 'off', // 아래 @typescript-eslint/no-shadow 과의 충돌을 피하기 위해 off 처리
    '@typescript-eslint/no-shadow': ['error'],
    'no-use-before-define': ['error', { functions: true, classes: true }],
    'import/no-unresolved': 'error',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['acc', 'ctx'],
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
