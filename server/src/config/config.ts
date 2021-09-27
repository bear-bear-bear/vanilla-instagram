import path from 'path';

import dotenv from 'dotenv';
import type { Dialect } from 'sequelize';

const { env } = process;

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(__dirname, '..', '..', `.env.production`) });
} else {
  dotenv.config({ path: path.join(__dirname, '..', '..', `.env.development`) });
}

interface SequelizeConstructOptions {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}
type Environment = 'development' | 'production';
type Config = {
  [key in Environment]: SequelizeConstructOptions;
};

const config: Config = {
  development: {
    username: env.DB_USERNAME || 'root',
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE || 'instagram_development',
    host: env.DB_HOST || 'localhost',
    dialect: env.DB_DIALECT || 'mysql',
  } as SequelizeConstructOptions,
  production: {
    username: env.DB_USERNAME || 'root',
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    dialect: env.DB_DIALECT,
  } as SequelizeConstructOptions,
};

const nodeEnv = env.NODE_ENV as Environment;
const currConfig = config[nodeEnv] || config.development;

const isUndefinedValue = Object.values(currConfig).find((v) => v === undefined);
if (isUndefinedValue) {
  throw new TypeError('데이터베이스 필수 환경 설정 값이 누락되었습니다.');
}

export default currConfig;
