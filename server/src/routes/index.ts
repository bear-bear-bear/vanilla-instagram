import Router from 'koa-router';
import hotRouter from './hot';
import smsRouter from './sms';
import userRouter from './user';

const router = new Router();

export const PREFIX = '/api';
router.prefix(PREFIX);

// TODO: 프런트 측에 에러 페이지 요구
router.use('(.*)', async (ctx, next) => {
  try {
    await next();
    if (!ctx.body) {
      ctx.status = 404;
      ctx.body = '404 not found';
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: '500 server error' };
    ctx.app.emit('error', err, ctx);
  }
});

if (process.env.NODE_ENV !== 'production') {
  router.use('/hot', hotRouter.routes());
}
router.use('/sms', smsRouter.routes());
router.use('/user', userRouter.routes());

export default router;
