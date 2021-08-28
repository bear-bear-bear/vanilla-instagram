import path from 'path';

import Koa from 'koa';
import dotenv from 'dotenv';
import serve from 'koa-static';
import bodyParser from 'koa-body';
import session from 'koa-session';
import logger from 'koa-logger';
// import cors from 'cors';

import db from './models';
import router from './routes';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(__dirname, '..', `.env.production`) });
} else {
  dotenv.config({ path: path.join(__dirname, '..', `.env.development`) });
}

const app = new Koa();
export const staticDir = path.join(__dirname, 'public'); // build from client

db.sequelize
  .sync({ force: false, logging: false })
  .catch((err) => console.error(err.message))
  .finally(() => db.sequelize.close());

app.use(logger());
app.use(bodyParser());
app.keys = [process.env.COOKIE_SECRET as string];

const sessionOption = {
  maxAge: 3 * 60 * 1000,
  renew: false,
  key: process.env.COOKIE_SECRET,
};
app.use(session(sessionOption, app));

const serveOptions = {
  extensions: ['html', 'css', 'js'],
};
app.use(serve(staticDir, serveOptions));

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
