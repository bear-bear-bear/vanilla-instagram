import { pathsToModuleNameMapper } from 'ts-jest/utils';
import type { Config } from '@jest/types';

import { compilerOptions } from './tsconfig.json';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  displayName: {
    name: 'SERVER',
    color: 'blue',
  },
  errorOnDeprecated: true,
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' } ),
  transform: {
    '\\.ts$': 'ts-jest',
    '\\.js$': 'babel-jest',
  },
  testRegex: '^.+\\.test\\.[jt]s$',
};

export default config;
