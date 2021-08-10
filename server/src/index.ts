import path from 'path';
import fs from 'fs';

import Koa from 'koa';
import Router from 'koa-router';
import dotenv from 'dotenv';
import serve from 'koa-static';

dotenv.config();
const app = new Koa();
const router = new Router();

const STATIC_DIR = path.join(__dirname, 'public');

app.use(router.routes());
app.use(serve(STATIC_DIR));

/**
 * @desc
 * hmr 과 유사한 효과를 낼 수 있게 해주는 미들웨어 (코드 분할 예정)
 * 클라이언트단 번들 결과물 변경시 SSE 를 통해 브라우저에 신호를 전송하여 리로드하게 합니다. (신호 감지 후 리로드하는 로직은 클라이언트 쪽에 있습니다)

  원리를 정리하면 아래와 같음
  1. 프론트엔드 작업 공간에서 무언가 코드를 작성
  2. 프론트엔드측 webpack watch 모드가 변경을 감지하여 리빌드
  3. koa 서버에서 빌드 디렉터리의 변경을 감지하여 브라우저에 신호 보냄 (SSE)
  4. 해당 신호를 client/app/entries/common.js 에서 해당 신호를 받아 브라우저 리로딩  (리로딩하는 이유 - 서버에 데이터 재요청을 보내게 되어 변경된 데이터가 적용될 수 있게 함)
 */
if (process.env.NODE_ENV !== 'production') {
  app.use(async (ctx, next) => {
    if (ctx.path !== '/sse') {
      await next();
      return;
    }

    ctx.request.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);

    ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const { PassThrough } = await import('stream');
    const stream = new PassThrough();

    ctx.status = 200;
    ctx.body = stream;

    const toSSEStream = (str: string) => `data: ${str}\n\n`;

    // fs.watch의 이중실행 이슈를 방지하기 위한 쓰로틀링
    let watching: ReturnType<typeof setTimeout>;
    fs.watch(STATIC_DIR, undefined, (event) => {
      if (watching) {
        clearTimeout(watching);
      }
      watching = setTimeout(() => {
        stream.write(toSSEStream(event)); // 번들 파일 변경시 브라우저로 SSE
        clearTimeout(watching);
      }, 200);
    });
  });
}

/**
 * @desc default error handler (내부 코드 수정 및 분할 예정)
 */
app.use(async (ctx, next) => {
  try {
    await next();
    if (!ctx.body) {
      // no resources
      ctx.status = 404;
      ctx.body = 'not found';
    }
  } catch (err) {
    // If the following code reports an error, return 500
    ctx.status = 500;
    ctx.body = 'server error';
  }
});

// FiXME: 모든 요청에 대해 200 코드 반환 중. 수정하기
/**
 * @desc default success handler (내부 코드 수정 및 분할 예정)
 */
app.use((ctx) => {
  ctx.status = 200;
  ctx.body = 'ok';
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`🌟 http://localhost:${PORT} 🌟`);
});

/**
 * @desc 테스트를 위한 서버 export
 * 테스트 방식을 변경하고 싶으시면 재작성 바람
 */
export default app;
