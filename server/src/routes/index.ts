import Router from 'koa-router';
import hotRouter from './hot';
import smsRouter from './sms';
import userRouter from './user';

const router = new Router();

router.use('(.*)', async (ctx, next) => {
  try {
    await next();
    if (!ctx.body) {
      ctx.status = 404;
      ctx.body = '404 not found';
    }
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = '500 server error';
  }
});

if (process.env.NODE_ENV !== 'production') {
  router.use('/hot', hotRouter.routes());
}
router.use('/sms', smsRouter.routes());
router.use('/user', userRouter.routes());

export default router;
