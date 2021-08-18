import request from 'supertest';

import app, { appListener } from 'app';

/**
 * @modifier galaxy4276
 * @comment 기존 테스트는 서버가 사전에 수동으로 실행되어 있어야 진행되던 방식 -> CI 에서는 구현하기 힘듬
 * @solution 테스트 서버를 따로 실행하고 테스트 내부에서 제어할 수 있게 변경
 * @problem sequelize Promise 부분을 읽어오지 못하는 이슈를 발생시키고 있습니다. ( 참고 )
 */
describe('서버 실행 환경 테스트',  () => {
  afterAll(() => {
    appListener.close();
  });

  test('Example route test', async () => {
    const response = await request(app.callback()).get('/');

    expect(response).toBeDefined();
  })
});
