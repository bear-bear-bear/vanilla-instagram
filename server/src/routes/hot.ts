import Router from 'koa-router';
import hotReloadingSSE from 'src/controllers/hot';

const router = new Router();

router.get('/', hotReloadingSSE);

export default router;
