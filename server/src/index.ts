import Koa from 'koa';
import Router from 'koa-router';
import dotenv from 'dotenv';

import startSnowpackServer from '@lib/startSnowpackServer';

dotenv.config();
const app = new Koa();
const router = new Router();
const server = await startSnowpackServer();

// default error handler (수정 예정)
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

app.use(router.routes());
app.use(async (ctx, next) => {
  const buildResult = await server.loadUrl(ctx.request.url);
  ctx.body = buildResult?.contents;
  next();
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening to port ${process.env.PORT}`);
});
