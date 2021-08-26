import request from 'supertest';
import app from 'src/app';

test('Example test: GET "/foobar"는 404를 반환합니다.', async () => {
    const response = await request(app.callback()).get('/foobar');
    expect(response.status).toBe(404);
});
