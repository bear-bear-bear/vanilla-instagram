import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: {
    name: 'SERVER',
    color: 'blue',
  },
  errorOnDeprecated: true,
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: './',
  moduleNameMapper: { '@/(.*)$': '<rootDir>/src/$1' },
  transform: {
    '\\.ts$': 'ts-jest',
    '\\.js$': 'babel-jest',
  },
  testRegex: '^.+\\.test\\.[jt]s$',
};

export default config;

// Or async function
// export default async (): Promise<Config.InitialOptions> => {
//   return {
//     verbose: true,
//   };
// };
