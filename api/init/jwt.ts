import * as Koa from 'koa';
import * as jwt from 'koa-jwt';

export function initJWT(app: Koa, secret: string) {

  // Initialize JWT secret.
  app.use(jwt({
    secret: `${secret}`,
    passthrough: true,
  }));
}
