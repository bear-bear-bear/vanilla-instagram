import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { sync as rm } from 'del';
import dotenv from 'dotenv';

import { connectDB } from 'src/models';
import config from 'src/config/config';

const rootDir = path.join(__dirname, '..', '..'); // π© High risk, because path is relative

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(rootDir, `.env.production`) });
} else {
  dotenv.config({ path: path.join(rootDir, `.env.development`) });
}

/**
 * @desc μ§μ  μ§μ ν root λλ ν°λ¦¬μ μ ν¨μ± κ²μ¦
 */
const validateRootDir = (dirname: string): void => {
  const isRootDir = (pathLike: string) => fs.readdirSync(pathLike).includes('node_modules');

  if (!isRootDir(dirname)) {
    throw new Error(`λ£¨νΈλ‘ μμν κ²½λ‘ ${dirname}μ node_modules/ κ° μ‘΄μ¬νμ§ μμ΅λλ€.`);
  }
};

/**
 * @desc μμμ json μ μμ±νμ¬ npx sequelize db:create λͺλ Ήμ΄λ₯Ό μνν©λλ€. λ°°ν¬ λͺ¨λκ° μλλΌλ©΄ μλ© λν μνν©λλ€.
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
