import { encodingExists } from 'iconv-lite';
import app from 'src/app';

const mockListen = jest.fn();
app.listen = mockListen;
encodingExists('foo');

afterEach(() => {
    mockListen.mockReset();
});

it('서버가 동작합니다.', async () => {
    await import('src/server');
    expect(mockListen.mock.calls.length).toBe(1);
    expect(mockListen.mock.calls[0][0]).toBe(process.env.PORT || 8001);
});
