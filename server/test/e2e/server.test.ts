import request from 'supertest';

import app from 'app';

describe('서버 실행 환경 테스트',  () => {
  test('Example route test', async () => {
    const response = await request(app.callback()).get('/');

    expect(response).toBeDefined();
  })
});
