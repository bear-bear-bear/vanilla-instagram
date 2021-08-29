import path from 'path';

import { writeFile, mkdir, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { sync as rm } from 'del';

import config from '../config/config';

const rootDir = path.join(__dirname, '..', '..'); // 🚩 High risk, because path is relative

const validateRootDir = (dirname: string): void => {
  const isRootDir = (pathLike: string) => readdirSync(pathLike).includes('node_modules');

  if (!isRootDir(dirname)) {
    throw new Error(`루트로 예상한 경로 ${dirname}에 node_modules/ 가 존재하지 않습니다.`);
  }
};
validateRootDir(rootDir);

/**
 * @desc 임의의 json 을 생성하여 npx sequelize db:create 명령어를 수행합니다.
 */
const createDatabase = () => {
  const sequelizeConfigJson = JSON.stringify(config);
  const sequelizeConfigDirname = path.join(rootDir, 'config');

  rm(sequelizeConfigDirname);

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

createDatabase();
