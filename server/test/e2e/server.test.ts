import request from 'supertest';
import { Server } from 'http';
import app from '../../src';

describe('서버 실행 환경 테스트', () => {
  let server: Server;

  beforeAll(() => {
    server = app.listen(8080);
  });

  afterAll(() => {
    server.close();
  });

  it('서버가 정상적으로 작동한다.', async () => {
    await request(server)
      .head('/')
      .then(({ statusCode }) => {
        expect(statusCode).toBe(200);
      });
  });
})
