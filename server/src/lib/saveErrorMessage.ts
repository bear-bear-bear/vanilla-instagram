import path from 'path';
import { promises as fsPromise } from 'fs';

export default async function saveErrorMessage(err: unknown): Promise<void> {
  console.error(err);

  const timeOffset = new Date().getTimezoneOffset() * 60000;
  const now = new Date(Date.now() - timeOffset).toISOString();
  const today = now.split('T')[0];

  const logDir = path.join(__dirname, '..', 'log');
  const logFile = path.join(logDir, `${today}.log`);

  try {
    await fsPromise.access(logDir);
  } catch {
    console.log('log/ 가 없으므로 새로 생성합니다.');
    await fsPromise.mkdir(logDir);
  }

  console.log('서버 에러를 로그에 기록합니다.');

  try {
    if (err instanceof Error) {
      await fsPromise.appendFile(logFile, `[${now}] --> ${err.stack || err.message}\n\n`);
      return;
    }
    console.error('"err" 인자가 "Error" 의 인스턴스가 아니라 로그에 기록할 수 없습니다.');
  } catch (error) {
    console.error(error);
  }
}
