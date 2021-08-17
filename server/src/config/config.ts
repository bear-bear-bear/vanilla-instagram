import { writeFile, mkdir } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';
import type { Dialect } from 'sequelize';
import { sync as rm } from 'del';

dotenv.config({ path: path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`) });

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
    dialect: process.env.DB_DIALECT || 'mariadb',
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
function createDatabase() {
  const jsonConfig = JSON.stringify(config[env]);
  mkdir(path.join(__dirname, '..', '..', 'config'), (err) => {
    if (err) process.exit(1);
    writeFile(path.join(__dirname, '..', '..', 'config', 'config.json'), jsonConfig, (err) => {
      if (err) process.exit(1);
      execSync('npx sequelize db:create');
      rm(path.join(__dirname, '..', '..', 'config'));
      console.log('데이터베이스 생성완료');
    });
  });
}

if (process.argv[2] === '--create') {
  createDatabase();
}
