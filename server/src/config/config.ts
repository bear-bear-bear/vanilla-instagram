import path from 'path';
import dotenv from 'dotenv';
import type { Dialect } from 'sequelize';

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
