import { writeFile, mkdir, readdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

import dotenv from 'dotenv';
import { sync as rm } from 'del';
import type { Dialect } from 'sequelize';

const rootDir = path.join(__dirname, '..', '..'); // 🚩 High risk, because path is relative

const validateRootDir = (dirname: string): void => {
  const isRootDir = (pathLike: string) => readdirSync(pathLike).includes('node_modules');

  if (!isRootDir(dirname)) {
    throw new Error(`루트로 예상한 경로 ${dirname}에 node_modules/ 가 존재하지 않습니다.`);
  }
};
validateRootDir(rootDir);

dotenv.config({ path: path.join(rootDir, `.env.${process.env.NODE_ENV}`) });

type Environment = 'development' | 'production';
interface SequelizeConstructOptions {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}
type Config = {
  [Environment: string]: SequelizeConstructOptions;
};

const config: Config = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'instagram_development',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
  } as SequelizeConstructOptions,
  production: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  } as SequelizeConstructOptions,
};

const env = (process.env.NODE_ENV as Environment) || 'development';
const isUndefinedValue = Object.values(config[env]).find((v) => v === undefined);
if (isUndefinedValue) {
  throw new Error('데이터베이스 필수 환경 설정 값이 누락되었습니다.');
}

export default config[env];

/**
 * @desc 임의의 json 을 생성하여 npx sequelize db:create 명령어를 수행합니다.
 */
const createDatabase = () => {
  const sequelizeConfigJson = JSON.stringify(config[env]);
  const sequelizeConfigDirname = path.join(rootDir, 'config');

  mkdir(sequelizeConfigDirname, (err) => {
    if (err) throw err;
    writeFile(path.join(sequelizeConfigDirname, 'config.json'), sequelizeConfigJson, (error) => {
      if (error) throw error;
      execSync('npx sequelize-cli db:create');
      rm(sequelizeConfigDirname);
      console.log('데이터베이스 생성완료');
    });
  });
};

if (process.argv.includes('--create')) {
  createDatabase();
}
