import request from 'supertest';

import app, { appListener } from 'app';

describe('서버 실행 환경 테스트',  () => {
  afterAll(() => {
    appListener.close();
  });

  test('Example route test', async () => {
    const response = await request(app.callback()).get('/');

    expect(response).toBeDefined();
  })
});
