import { join } from 'path';
import Koa from 'koa';
import yamljs from 'yamljs';
import { koaSwagger } from 'koa2-swagger-ui';

export default function setKoaMiddleware(app: Koa): void {
  const spec = yamljs.load(join(__dirname, '..', '..', 'api.yaml'));
  app.use(
    koaSwagger({
      routePrefix: '/',
      title: 'Vanilla Instagram APIs',
      swaggerOptions: { spec },
    })
  );
}
