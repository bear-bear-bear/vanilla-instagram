import fs from 'fs';
import type { Context } from 'koa';

import { staticDir } from 'src/app';

/**
 * @desc
 * hmr 과 유사한 효과를 낼 수 있게 해주는 미들웨어 (코드 분할 예정)
 * 클라이언트단 번들 결과물 변경시 SSE 를 통해 브라우저에 신호를 전송하여 리로드하게 합니다. (신호 감지 후 리로드하는 로직은 클라이언트 쪽에 있습니다)

  1. 프론트엔드 작업 공간에서 무언가 코드를 작성
  2. 프론트엔드측 webpack watch 모드가 변경을 감지하여 리빌드
  3. koa 서버에서 빌드 디렉터리의 변경을 감지하여 브라우저에 신호 전송 (SSE)
  4. 해당 신호를 client/app/entries/common.js 에서 해당 신호를 받아 브라우저 리로딩  (리로딩하는 이유 - 서버에 데이터 재요청을 보내게 되어 변경된 데이터가 적용될 수 있게 함)
 */
const hotReloadingSSE = async (ctx: Context): Promise<void> => {
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
  fs.watch(staticDir, undefined, (event) => {
    if (watching) {
      clearTimeout(watching);
    }
    watching = setTimeout(() => {
      stream.write(toSSEStream(event)); // 번들 파일 변경시 브라우저로 SSE
      clearTimeout(watching);
    }, 200);
  });
};

export default hotReloadingSSE;
