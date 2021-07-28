import Koa from 'koa';
import Router from 'koa-router';
import dotenv from 'dotenv';

dotenv.config();
const app = new Koa();
const router = new Router();

app.use(router.routes());

app.listen(process.env.PORT, () => {
  console.log(`Server is listening to port ${process.env.PORT}`);
});
