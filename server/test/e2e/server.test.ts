import request from 'supertest';

import app, { appListener } from 'app';

describe('서버 실행 환경 테스트',  () => {
  afterAll(() => {
    appListener.close();
  });

  test('Example route test', async () => {
    jest.useFakeTimers(); // FIXME: 임시 테스트 오류 해결  (ReferenceError: You are trying to `import` a file after the Jest environment has been torn down.)
    const response = await request(app.callback()).get('/');

    expect(response).toBeDefined();
  })
});
