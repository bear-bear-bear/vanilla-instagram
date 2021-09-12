import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { sync as rm } from 'del';
import dotenv from 'dotenv';

import { connectDB } from 'src/models';
import config from 'src/config/config';

const rootDir = path.join(__dirname, '..', '..'); // 🚩 High risk, because path is relative

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(rootDir, `.env.production`) });
} else {
  dotenv.config({ path: path.join(rootDir, `.env.development`) });
}

/**
 * @desc 직접 지정한 root 디렉터리의 유효성 검증
 */
const validateRootDir = (dirname: string): void => {
  const isRootDir = (pathLike: string) => fs.readdirSync(pathLike).includes('node_modules');

  if (!isRootDir(dirname)) {
    throw new Error(`루트로 예상한 경로 ${dirname}에 node_modules/ 가 존재하지 않습니다.`);
  }
};

/**
 * @desc 임의의 json 을 생성하여 npx sequelize db:create 명령어를 수행합니다. 배포 모드가 아니라면 시딩 또한 수행합니다.
 */
const createDatabase = async () => {
  const { mkdir, writeFile, readdir, copyFile } = fs.promises;
  const configJson = JSON.stringify(config);
  const configDirTo = path.join(rootDir, 'config');
  const configFileTo = path.join(configDirTo, 'config.json');
  const seedersDirFrom = path.join(rootDir, 'src', 'seeders');
  const seedersDirTo = path.join(rootDir, 'seeders');

  const command = {
    CREATE_DB: 'npx sequelize-cli db:create',
    SEED_ALL: 'npx sequelize-cli db:seed:all',
    SEED_DROP_ALL: 'npx sequelize-cli db:seed:undo:all',
  };

  try {
    console.log('... CREATE DATABASE ... ');
    await mkdir(configDirTo);
    await writeFile(configFileTo, configJson);
    execSync(command.CREATE_DB);

    console.log('... APPLY SCHEMA ... ');
    await connectDB({ keep: false });

    if (process.env.NODE_ENV !== 'production') {
      console.log('... SEEDING ... ');
      await mkdir(seedersDirTo);
      const seederList = await readdir(seedersDirFrom);
      const seederCopyPromises = seederList.map((seeder) => {
        const from = path.join(seedersDirFrom, seeder);
        const to = path.join(seedersDirTo, seeder);
        return copyFile(from, to);
      });
      await Promise.all(seederCopyPromises);
      execSync(command.SEED_DROP_ALL);
      execSync(command.SEED_ALL);
      rm(seedersDirTo);
    }

    rm(configDirTo);
    console.log('DONE');
  } catch (err) {
    rm(configDirTo);
    rm(seedersDirTo);
    console.error(err);
  }
};

validateRootDir(rootDir);
(async () => {
  await createDatabase();
})();
