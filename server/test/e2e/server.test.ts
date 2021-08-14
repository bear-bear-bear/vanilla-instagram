import request from 'supertest';
import runningStatusApp from '../../src';

describe('서버 실행 환경 테스트', () => {
  beforeAll(() => {
    runningStatusApp.close();
  });

  it('서버가 정상적으로 작동한다.', async () => {
    await request(runningStatusApp)
      .head('/')
      .then(({ statusCode }) => {
        expect(statusCode).toBe(200);
      });
  });
})
