import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: {
    name: 'SERVER',
    color: 'blue',
  },
  errorOnDeprecated: true,
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  moduleNameMapper: { '^@root/(.*)$': '<rootDir>/src/$1' },
  transform: {
    '\\.ts$': 'ts-jest',
    '\\.js$': 'babel-jest',
  },
  testRegex: '^.+\\.test\\.[jt]s$',
};

export default config;
